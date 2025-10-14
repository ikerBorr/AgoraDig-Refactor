import { DomainException } from '@/contexts/shared-kernel/domain/exceptions/domain.exception'
import { DomainExceptionCode } from '@/contexts/shared-kernel/domain/exceptions/domain-code.exception'

export class BirthDateNotANumberError extends DomainException {
    readonly name = 'BIRTH_DATE_NOT_A_NUMBER'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor() {
        super('Birth date must be a valid number.')
    }
}

export class BirthDateInvalidFormatError extends DomainException {
    readonly name = 'BIRTH_DATE_INVALID_FORMAT'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor() {
        super('Birth date format is invalid.')
    }
}

export class BirthDateInFutureError extends DomainException {
    readonly name = 'BIRTH_DATE_IN_FUTURE'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor() {
        super('Birth date cannot be in the future.')
    }
}

export * as BirthDateErrors from './birth-date.exceptions'
