import { DomainException } from '@/contexts/shared-kernel/domain/exceptions/domain.exception'
import { DomainExceptionCode } from '@/contexts/shared-kernel/domain/exceptions/domain-code.exception'

export class UsernameLengthOutOfRangeError extends DomainException {
    readonly name = 'USERNAME_LENGTH_OUT_OF_RANGE'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor(min: number, max: number, current: number) {
        super(`Username length must be between ${min} and ${max} characters (got ${current}).`)
    }
}

export class UsernameInvalidCharactersError extends DomainException {
    readonly name = 'USERNAME_INVALID_CHARACTERS'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor() {
        super('Username can only contain letters, numbers, underscores (_) and dots (.).')
    }
}

export * as UsernameErrors from './username.exceptions'
