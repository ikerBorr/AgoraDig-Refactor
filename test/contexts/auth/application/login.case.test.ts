import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest'
import type { AuthUserRepository } from '@/contexts/auth/domain/ports/auth-user.repository'
import { LoginCase } from '@/contexts/auth/application/use-cases/login.case'
import { IdentifierMother } from '@test/contexts/auth/domain/mothers/identifier.mother'
import { PasswordMother } from '@test/contexts/auth/domain/mothers/password.mother'
import { AuthUserMother } from '@test/contexts/auth/domain/mothers/auth-user.mother'
import { PasswordMismatchError } from '@/contexts/auth/domain/exceptions/password.exceptions'
import { LoginErrors } from '@/contexts/auth/application/exceptions/login.exceptions'

describe('LoginCase', () => {
    let repository: Mocked<AuthUserRepository>
    let useCase: LoginCase

    beforeEach(() => {
        repository = {
            save: vi.fn(),
            searchByIdentifier: vi.fn(),
        }
        useCase = new LoginCase(repository)
        vi.restoreAllMocks()
    })

    it('should log in successfully with a valid email and correct password', async () => {
        const email = IdentifierMother.randomEmail()
        const plain = PasswordMother.strongPlain()
        const user = AuthUserMother.withIdentifier(email.value, { plainPassword: plain })

        repository.searchByIdentifier.mockResolvedValue(user)

        const result = await useCase.login(email.value, plain)

        expect(repository.searchByIdentifier).toHaveBeenCalledTimes(1)
        const calledWithIdentifier = repository.searchByIdentifier.mock.calls[0]![0]!
        expect(calledWithIdentifier.value).toBe(email.value)

        expect(result).toEqual({
            uuid: user.uuid.value,
            identifier: user.identifier.value,
        })
    })

    it('should log in successfully with a valid username and correct password', async () => {
        const username = IdentifierMother.randomUsername()
        const plain = PasswordMother.strongPlain()
        const user = AuthUserMother.withIdentifier(username.value, { plainPassword: plain })

        repository.searchByIdentifier.mockResolvedValue(user)

        const result = await useCase.login(username.value, plain)

        expect(result.uuid).toBe(user.uuid.value)
        expect(result.identifier).toBe(user.identifier.value)
    })

    it('should throw an InvalidCredentialsError if the user does not exist', async () => {
        const anyIdentifier = IdentifierMother.random()
        repository.searchByIdentifier.mockResolvedValue(null)

        await expect(
            useCase.login(anyIdentifier.value, PasswordMother.strongPlain()),
        ).rejects.toBeInstanceOf(LoginErrors.InvalidCredentialsError)
    })

    it('should throw an InvalidCredentialsError if the password does not match', async () => {
        const id = IdentifierMother.random()
        const correctPlain = PasswordMother.strongPlain()
        const wrongPlain = PasswordMother.strongPlain()

        const user = AuthUserMother.withIdentifier(id.value, { plainPassword: correctPlain })
        const assertSpy = vi.spyOn(user.password, 'assertMatches').mockImplementation(() => {
            throw new PasswordMismatchError()
        })

        repository.searchByIdentifier.mockResolvedValue(user)

        await expect(useCase.login(id.value, wrongPlain)).rejects.toBeInstanceOf(
            LoginErrors.InvalidCredentialsError,
        )

        expect(assertSpy).toHaveBeenCalledWith(wrongPlain)
    })

    it('should propagate any unexpected error that occurs during password verification', async () => {
        const id = IdentifierMother.random()
        const plain = PasswordMother.strongPlain()
        const user = AuthUserMother.withIdentifier(id.value, { plainPassword: plain })

        const unexpected = new Error('PBKDF2 crash')
        vi.spyOn(user.password, 'assertMatches').mockImplementation(() => {
            throw unexpected
        })

        repository.searchByIdentifier.mockResolvedValue(user)

        await expect(useCase.login(id.value, plain)).rejects.toBe(unexpected)
    })

    it('should throw a UserBannedError if the user is banned', async () => {
        const id = IdentifierMother.random()
        const plain = PasswordMother.strongPlain()
        const user = AuthUserMother.withIdentifier(id.value, { plainPassword: plain, banned: true })

        repository.searchByIdentifier.mockResolvedValue(user)

        await expect(useCase.login(id.value, plain)).rejects.toBeInstanceOf(
            LoginErrors.UserBannedError,
        )
    })

    it('should propagate repository errors (e.g., database error)', async () => {
        const id = IdentifierMother.random()
        const repoError = new Error('DB connection timeout')
        repository.searchByIdentifier.mockRejectedValue(repoError)

        await expect(useCase.login(id.value, PasswordMother.strongPlain())).rejects.toBe(repoError)
    })

    it('should fail if the identifier is invalid (Identifier domain error)', async () => {
        const invalid = 'spaces not allowed@@'
        await expect(useCase.login(invalid, PasswordMother.strongPlain())).rejects.toBeTruthy()
    })
})
