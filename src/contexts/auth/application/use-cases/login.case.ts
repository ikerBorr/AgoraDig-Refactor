import type { AuthUserRepository } from '@/contexts/auth/domain/ports/auth-user.repository'
import { Identifier } from '@/contexts/auth/domain/value-objects/identifier'
import type { AuthUser } from '@/contexts/auth/domain/entities/auth-user'
import { LoginErrors } from '@/contexts/auth/application/exceptions/login.exceptions'
import { PasswordMismatchError } from '@/contexts/auth/domain/exceptions/password.exceptions'
import { inject } from 'inversify'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/types'
import type { JwtGenerator } from '@/contexts/auth/domain/ports/jwt-generator'

export class LoginCase {
    constructor(
        @inject(AUTH_CONTAINER.AuthUserRepository)
        private readonly userRepository: AuthUserRepository,
        @inject(AUTH_CONTAINER.JwtGenerator)
        private readonly jwtGenerator: JwtGenerator,
    ) {}

    async login(identifierRaw: string, password: string): Promise<string> {
        const identifier = Identifier.from(identifierRaw)

        const user = await this.findUser(identifier)

        this.validatePassword(user, password)

        // TODO: Implement login attempt rate limiting using Redis (track attempts per IP and identifier).

        if (user.banned) throw new LoginErrors.UserBannedError()

        return await this.jwtGenerator.execute({
            uuid: user.uuid.value,
            identifier: user.identifier.value,
            banned: user.banned,
        })
    }

    private async findUser(identifier: Identifier): Promise<AuthUser> {
        const user = await this.userRepository.searchByIdentifier(identifier)
        if (!user) {
            throw new LoginErrors.InvalidCredentialsError()
        }
        return user
    }

    private validatePassword(user: AuthUser, password: string): void {
        try {
            user.password.assertMatches(password)
        } catch (error) {
            if (error instanceof PasswordMismatchError) {
                throw new LoginErrors.InvalidCredentialsError()
            }
            throw error
        }
    }
}
