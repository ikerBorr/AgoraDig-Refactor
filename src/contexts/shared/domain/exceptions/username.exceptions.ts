import {DomainException} from "@/contexts/shared/domain/exceptions/domain.exception";

export class UsernameLengthOutOfRangeError extends DomainException {
    readonly name = 'USERNAME_LENGTH_OUT_OF_RANGE'
    constructor(min: number, max: number, current: number) {
        super(`Username length must be between ${min} and ${max} characters (got ${current}).`)
    }
}

export class UsernameInvalidCharactersError extends DomainException {
    readonly name = 'USERNAME_INVALID_CHARACTERS'
    constructor() {
        super('Username can only contain letters, numbers, underscores (_) and dots (.).')
    }
}

export * as UsernameErrors from './username.exceptions'
