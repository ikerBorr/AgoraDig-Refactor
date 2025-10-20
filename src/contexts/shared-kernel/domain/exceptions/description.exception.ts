import { DomainException } from '@/contexts/shared-kernel/domain/exceptions/domain.exception'
import { DomainExceptionCode } from '@/contexts/shared-kernel/domain/exceptions/domain-code.exception'

export class DescriptionTooLongError extends DomainException {
    readonly name = 'DESCRIPTION_TOO_LONG'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor(max: number, current: number) {
        super(`Description cannot exceed ${max} characters (got ${current}).`)
    }
}

export * as DescriptionErrors from './description.exception'
