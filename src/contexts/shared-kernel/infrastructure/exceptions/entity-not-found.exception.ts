import { InfrastructureException } from '@/contexts/shared-kernel/infrastructure/exceptions/infrastructure.exception'
import { InfrastructureExceptionCode } from '@/contexts/shared-kernel/infrastructure/exceptions/infrastructure-code.exception'

export class EntityNotFoundException extends InfrastructureException {
    readonly name = 'ENTITY_NOT_FOUND'
    readonly code = InfrastructureExceptionCode.ENTITY_NOT_FOUND

    constructor(msg: string) {
        super(`Entity not found exception: ${msg}`)
    }
}
