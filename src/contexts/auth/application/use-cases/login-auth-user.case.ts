import type { AuthUserRepository } from '@/contexts/auth/domain/ports/auth-user.repository'
import { Identifier } from '@/contexts/auth/domain/value-objects/identifier'
import type { AuthUser } from '@/contexts/auth/domain/entities/auth-user'
import { LoginErrors } from '@/contexts/auth/application/exceptions/login.exception'
import { PasswordMismatchError } from '@/contexts/auth/domain/exceptions/password.exceptions'
import { inject } from 'inversify'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/symbols'
import type { JwtGenerator } from '@/contexts/auth/domain/ports/jwt-generator'
import type { LoginCommand } from '@/contexts/auth/application/commands/login.command'
import { EntityNotFoundException } from '@/contexts/shared-kernel/infrastructure/exceptions/entity-not-found.exception'
import type { LoginResponseDto } from '@/contexts/auth/application/dto/login-response.dto'

export class LoginAuthUserCase {
    constructor(
        @inject(AUTH_CONTAINER.AuthUserRepository)
        private readonly userRepository: AuthUserRepository,
        @inject(AUTH_CONTAINER.JwtGenerator)
        private readonly jwtGenerator: JwtGenerator,
    ) {}

    async execute(command: LoginCommand): Promise<LoginResponseDto> {
        const identifier = Identifier.from(command.identifier)

        const user = await this.findUser(identifier)

        this.validatePassword(user, command.password)

        // TODO: Implement login attempt rate limiting using Redis (track attempts per IP and identifier).

        if (user.banned) throw new LoginErrors.UserBannedError()

        const credentials = user.secureCredentials()
        const accessToken = await this.jwtGenerator.encode(credentials)

        return { accessToken, user: credentials }
    }

    private async findUser(identifier: Identifier): Promise<AuthUser> {
        try {
            return await this.userRepository.findByIdentifier(identifier)
        } catch (error) {
            if (error instanceof EntityNotFoundException) {
                throw new LoginErrors.InvalidCredentialsError()
            }
            throw error
        }
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
