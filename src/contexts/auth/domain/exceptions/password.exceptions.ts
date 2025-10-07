import { DomainException } from '../../../shared/domain/exceptions/domain.exception'

export class PasswordHashFormatInvalidError extends DomainException {
    readonly name = 'PASSWORD_HASH_FORMAT_INVALID'
    constructor() {
        super('Invalid password hash format.')
    }
}

export class PasswordTooShortError extends DomainException {
    readonly name = 'PASSWORD_TOO_SHORT'
    constructor(min: number, current: number) {
        super(`Password must be at least ${min} characters long (got ${current}).`)
    }
}

export class PasswordComplexityNotMetError extends DomainException {
    readonly name = 'PASSWORD_COMPLEXITY_NOT_MET'
    constructor() {
        super('Password must include uppercase, lowercase, number, and special character.')
    }
}

export class PasswordMismatchError extends DomainException {
    readonly name = 'PASSWORD_MISMATCH'
    constructor() {
        super('The provided password is incorrect.')
    }
}

export * as PasswordErrors from './password.exceptions'
