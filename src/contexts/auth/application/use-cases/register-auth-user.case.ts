import type { AuthUserRepository } from '@/contexts/auth/domain/ports/auth-user.repository'
import { Identifier } from '@/contexts/auth/domain/value-objects/identifier'
import { AuthUser } from '@/contexts/auth/domain/entities/auth-user'
import { inject } from 'inversify'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/symbols'
import type { RegisterCommand } from '@/contexts/auth/application/commands/register.command'
import { Password } from '@/contexts/auth/domain/value-objects/password'
import { EntityAlreadyExistException } from '@/contexts/shared-kernel/infrastructure/exceptions/entity-already-exist.exception'
import type { RegistrationFlowRepository } from '@/contexts/auth/domain/ports/registration-flow.repository'
import { addHours } from 'date-fns'
import type { RegistrationResponseDto } from '@/contexts/auth/application/dto/registration-response.dto'

export class RegisterAuthUserCase {
    private readonly EXPIRATION_TIME = 48

    constructor(
        @inject(AUTH_CONTAINER.AuthUserRepository)
        private readonly userRepository: AuthUserRepository,
        @inject(AUTH_CONTAINER.RegistrationFlowRepository)
        private readonly registrationFlowRepository: RegistrationFlowRepository,
    ) {}

    async execute(command: RegisterCommand): Promise<RegistrationResponseDto> {
        const identifier = Identifier.from(command.identifier)
        const password = Password.fromPlain(command.password)

        const expirationDate = addHours(new Date(), this.EXPIRATION_TIME)

        const user = AuthUser.create(identifier, password)

        try {
            await this.userRepository.save(user)
        } catch (error) {
            if (!(error instanceof EntityAlreadyExistException)) {
                throw error
            }
        }

        const flowId = await this.registrationFlowRepository.save(user.identifier, expirationDate)

        return {
            nextAction: 'check_email',
            flowId: flowId.value,
            expireAt: expirationDate.valueOf(),
        }
    }
}
