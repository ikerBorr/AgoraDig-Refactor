import type { AuthUserRepository } from '@/contexts/auth/domain/ports/auth-user.repository'
import { Identifier } from '@/contexts/auth/domain/value-objects/identifier'
import { AuthUser, type AuthUserPrimitives } from '@/contexts/auth/domain/entities/auth-user'
import { LoginErrors } from '@/contexts/auth/application/exceptions/login.exception'
import { inject } from 'inversify'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/symbols'
import type { RegisterCommand } from '@/contexts/auth/application/commands/register.command'

export class RegisterCase {
    constructor(
        @inject(AUTH_CONTAINER.AuthUserRepository)
        private readonly userRepository: AuthUserRepository,
    ) {}

    async execute(command: RegisterCommand): Promise<AuthUserPrimitives> {
        const identifier = Identifier.from(command.identifier)

        let user = await this.findUser(identifier)
        if (user) {
            return user.toPrimitives()
        }

        user = AuthUser.create(command.identifier, command.password)

        await this.userRepository.save(user)

        return user.toPrimitives()
    }

    private async findUser(identifier: Identifier): Promise<AuthUser> {
        const user = await this.userRepository.searchByIdentifier(identifier)
        if (!user) {
            throw new LoginErrors.InvalidCredentialsError()
        }
        return user
    }
}
