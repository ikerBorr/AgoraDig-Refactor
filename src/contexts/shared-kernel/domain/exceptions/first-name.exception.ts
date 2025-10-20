import { DomainException } from '@/contexts/shared-kernel/domain/exceptions/domain.exception'
import { DomainExceptionCode } from '@/contexts/shared-kernel/domain/exceptions/domain-code.exception'

export class FirstNameLengthOutOfRangeError extends DomainException {
    readonly name = 'FIRST_NAME_LENGTH_OUT_OF_RANGE'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor(min: number, max: number, current: number) {
        super(`First name length must be between ${min} and ${max} characters (got ${current}).`)
    }
}

export class FirstNameInvalidCharactersError extends DomainException {
    readonly name = 'FIRST_NAME_INVALID_CHARACTERS'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor() {
        super(
            'First name can only contain alphabetic characters, spaces, hyphens, and apostrophes.',
        )
    }
}

export * as FirstNameErrors from './first-name.exception'
