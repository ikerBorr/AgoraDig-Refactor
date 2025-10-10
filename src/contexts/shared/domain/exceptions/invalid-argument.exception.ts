import { DomainException } from '@/contexts/shared/domain/exceptions/domain.exception'
import { DomainExceptionCode } from '@/contexts/shared/domain/exceptions/domain-code.exception'

export class InvalidArgumentError extends DomainException {
    readonly name = 'INVALID_ARGUMENT_ERROR'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor(message: string) {
        super(message)
    }
}
