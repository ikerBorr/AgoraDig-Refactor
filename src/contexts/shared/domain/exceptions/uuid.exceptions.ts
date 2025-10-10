import { DomainException } from '@/contexts/shared/domain/exceptions/domain.exception'
import { DomainExceptionCode } from '@/contexts/shared/domain/exceptions/domain-code.exception'

export class UuidInvalidFormatError extends DomainException {
    readonly name = 'UUID_INVALID_FORMAT'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor(value: string) {
        super(`Invalid UUID format: '${value}'`)
    }
}

export * as UuidErrors from './uuid.exceptions'
