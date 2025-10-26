import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest'
import type { AuthUserRepository } from '@/contexts/auth/domain/ports/auth-user.repository'
import { LoginAuthUserCase } from '@/contexts/auth/application/use-cases/login-auth-user.case'
import { IdentifierMother } from '@test/contexts/auth/domain/mothers/identifier.mother'
import { PasswordMother } from '@test/contexts/auth/domain/mothers/password.mother'
import { AuthUserMother } from '@test/contexts/auth/domain/mothers/auth-user.mother'
import { PasswordMismatchError } from '@/contexts/auth/domain/exceptions/password.exceptions'
import { LoginErrors } from '@/contexts/auth/application/exceptions/login.exception'
import type { JwtGenerator } from '@/contexts/auth/domain/ports/jwt-generator'
import { faker } from '@faker-js/faker'
import { EntityNotFoundException } from '@/contexts/shared-kernel/infrastructure/exceptions/entity-not-found.exception'

describe('LoginCase', () => {
    let repository: Mocked<AuthUserRepository>
    let jwtGenerator: Mocked<JwtGenerator>
    let useCase: LoginAuthUserCase

    beforeEach(() => {
        repository = {
            save: vi.fn(),
            searchByIdentifier: vi.fn(),
            findByIdentifier: vi.fn(),
        }

        jwtGenerator = {
            encode: vi.fn(),
            decode: vi.fn<<T>(token: string) => Promise<T>>(),
        } as Mocked<JwtGenerator>

        useCase = new LoginAuthUserCase(repository, jwtGenerator)
        vi.restoreAllMocks()
    })

    it('should log in successfully with a valid email and correct password', async () => {
        const email = IdentifierMother.randomEmail()
        const plain = PasswordMother.strongPlain()
        const user = AuthUserMother.withIdentifier(email.value, { plainPassword: plain })
        const session = faker.internet.jwt()

        repository.findByIdentifier.mockResolvedValue(user)
        jwtGenerator.encode.mockResolvedValue(session)

        const result = await useCase.execute({ identifier: email.value, password: plain })

        expect(repository.findByIdentifier).toHaveBeenCalledTimes(1)
        expect(jwtGenerator.encode).toHaveBeenCalledTimes(1)

        const repoCalledWithIdentifier = repository.findByIdentifier.mock.calls[0]![0]!
        expect(repoCalledWithIdentifier.value).toBe(email.value)

        const jwtCalledWithIdentifier = jwtGenerator.encode.mock.calls[0]![0]!
        expect(jwtCalledWithIdentifier).toStrictEqual({
            accountUuid: user.accountUuid.value,
            identifier: user.identifier.value,
            banned: user.banned,
        })

        expect(result.accessToken).toStrictEqual(session)
        expect(result.user).toStrictEqual(user.secureCredentials())
    })

    it('should log in successfully with a valid username and correct password', async () => {
        const username = IdentifierMother.randomUsername()
        const plain = PasswordMother.strongPlain()
        const user = AuthUserMother.withIdentifier(username.value, { plainPassword: plain })
        const session = faker.internet.jwt()

        repository.findByIdentifier.mockResolvedValue(user)
        jwtGenerator.encode.mockResolvedValue(session)

        const result = await useCase.execute({ identifier: username.value, password: plain })

        expect(result.accessToken).toStrictEqual(session)
        expect(result.user).toStrictEqual(user.secureCredentials())
    })

    it('should throw an InvalidCredentialsError if the user does not exist', async () => {
        const anyIdentifier = IdentifierMother.random()
        repository.findByIdentifier.mockRejectedValue(new EntityNotFoundException('User not found'))

        await expect(
            useCase.execute({
                identifier: anyIdentifier.value,
                password: PasswordMother.strongPlain(),
            }),
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

        repository.findByIdentifier.mockResolvedValue(user)

        await expect(
            useCase.execute({ identifier: id.value, password: wrongPlain }),
        ).rejects.toBeInstanceOf(LoginErrors.InvalidCredentialsError)

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

        repository.findByIdentifier.mockResolvedValue(user)

        await expect(useCase.execute({ identifier: id.value, password: plain })).rejects.toBe(
            unexpected,
        )
    })

    it('should throw a UserBannedError if the user is banned', async () => {
        const id = IdentifierMother.random()
        const plain = PasswordMother.strongPlain()
        const user = AuthUserMother.withIdentifier(id.value, { plainPassword: plain, banned: true })

        repository.findByIdentifier.mockResolvedValue(user)

        await expect(
            useCase.execute({ identifier: id.value, password: plain }),
        ).rejects.toBeInstanceOf(LoginErrors.UserBannedError)
    })

    it('should propagate repository errors (e.g., database error)', async () => {
        const id = IdentifierMother.random()
        const repoError = new Error('DB connection timeout')
        repository.findByIdentifier.mockRejectedValue(repoError)

        await expect(
            useCase.execute({ identifier: id.value, password: PasswordMother.strongPlain() }),
        ).rejects.toBe(repoError)
    })

    it('should fail if the identifier is invalid (Identifier domain error)', async () => {
        const invalid = 'spaces not allowed@@'
        await expect(
            useCase.execute({ identifier: invalid, password: PasswordMother.strongPlain() }),
        ).rejects.toBeTruthy()
    })
})
