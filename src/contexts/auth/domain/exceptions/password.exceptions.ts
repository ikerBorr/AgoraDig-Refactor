import { DomainException } from '@/contexts/shared-kernel/domain/exceptions/domain.exception'
import { DomainExceptionCode } from '@/contexts/shared-kernel/domain/exceptions/domain-code.exception'

export class PasswordHashFormatInvalidError extends DomainException {
    readonly name = 'PASSWORD_HASH_FORMAT_INVALID'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor() {
        super('Invalid password hash format.')
    }
}

export class PasswordTooShortError extends DomainException {
    readonly name = 'PASSWORD_TOO_SHORT'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor(min: number, current: number) {
        super(`Password must be at least ${min} characters long (got ${current}).`)
    }
}

export class PasswordComplexityNotMetError extends DomainException {
    readonly name = 'PASSWORD_COMPLEXITY_NOT_MET'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor() {
        super('Password must include uppercase, lowercase, number, and special character.')
    }
}

export class PasswordMismatchError extends DomainException {
    readonly name = 'PASSWORD_MISMATCH'
    readonly code = DomainExceptionCode.INVARIANT_VIOLATION

    constructor() {
        super('The provided password is incorrect.')
    }
}

export * as PasswordErrors from './password.exceptions'
