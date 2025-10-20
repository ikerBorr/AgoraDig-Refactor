import { DomainException } from '@/contexts/shared-kernel/domain/exceptions/domain.exception'
import { DomainExceptionCode } from '@/contexts/shared-kernel/domain/exceptions/domain-code.exception'

export class LastNameLengthOutOfRangeError extends DomainException {
    readonly name = 'LAST_NAME_LENGTH_OUT_OF_RANGE'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor(min: number, max: number, current: number) {
        super(`Last name length must be between ${min} and ${max} characters (got ${current}).`)
    }
}

export class LastNameInvalidCharactersError extends DomainException {
    readonly name = 'LAST_NAME_INVALID_CHARACTERS'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor() {
        super('Last name can only contain alphabetic characters, spaces, hyphens, and apostrophes.')
    }
}

export * as LastNameErrors from './last-name.exeption'
