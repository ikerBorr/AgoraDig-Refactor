import { InfrastructureException } from '@/contexts/shared-kernel/infrastructure/exceptions/infrastructure.exception'
import { InfrastructureExceptionCode } from '@/contexts/shared-kernel/infrastructure/exceptions/infrastructure-code.exception'

export class EntityAlreadyExistException extends InfrastructureException {
    readonly name = 'ENTITY_ALREADY_EXIST'
    readonly code = InfrastructureExceptionCode.ENTITY_ALREADY_EXIST

    constructor(msg: string) {
        super(`Entity already exception: ${msg}`)
    }
}
