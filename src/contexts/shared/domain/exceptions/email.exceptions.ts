import { DomainException } from './domain.exception'

export class EmailLengthOutOfRangeError extends DomainException {
    readonly name = 'EMAIL_LENGTH_OUT_OF_RANGE'
    constructor(min: number, max: number, current: number) {
        super(`Email length must be between ${min} and ${max} characters (got ${current}).`)
    }
}

export class EmailMissingAtError extends DomainException {
    readonly name = 'EMAIL_MISSING_AT'
    constructor() {
        super("Email must contain a single '@' character.")
    }
}

export class EmailMultipleAtError extends DomainException {
    readonly name = 'EMAIL_MULTIPLE_AT'
    constructor(count: number) {
        super(`Email must contain a single '@' (found ${count}).`)
    }
}

export class EmailLocalPartLengthError extends DomainException {
    readonly name = 'EMAIL_LOCAL_PART_LENGTH'
    constructor(max: number, current: number) {
        super(`Email local part must be 1–${max} characters (got ${current}).`)
    }
}

export class EmailLocalPartDotPositionError extends DomainException {
    readonly name = 'EMAIL_LOCAL_PART_DOT_POSITION'
    constructor() {
        super('Email local part cannot start or end with a dot.')
    }
}

export class EmailLocalPartConsecutiveDotsError extends DomainException {
    readonly name = 'EMAIL_LOCAL_PART_CONSECUTIVE_DOTS'
    constructor() {
        super('Email local part cannot contain consecutive dots.')
    }
}

export class EmailLocalPartInvalidCharsError extends DomainException {
    readonly name = 'EMAIL_LOCAL_PART_INVALID_CHARS'
    constructor() {
        super('Email local part contains invalid characters.')
    }
}

export class EmailDomainMissingTldError extends DomainException {
    readonly name = 'EMAIL_DOMAIN_MISSING_TLD'
    constructor() {
        super('Email domain must include a TLD (e.g., example.com).')
    }
}

export class EmailDomainLabelLengthError extends DomainException {
    readonly name = 'EMAIL_DOMAIN_LABEL_LENGTH'
    constructor(max: number) {
        super(`Each domain label must be 1–${max} characters.`)
    }
}

export class EmailDomainLabelInvalidCharsError extends DomainException {
    readonly name = 'EMAIL_DOMAIN_LABEL_INVALID_CHARS'
    constructor() {
        super('Domain labels can only contain letters, numbers, and hyphens.')
    }
}

export class EmailDomainLabelHyphenPositionError extends DomainException {
    readonly name = 'EMAIL_DOMAIN_LABEL_HYPHEN_POSITION'
    constructor() {
        super('Domain labels cannot start or end with a hyphen.')
    }
}

export class EmailTldInvalidError extends DomainException {
    readonly name = 'EMAIL_TLD_INVALID'
    constructor() {
        super('Top-level domain must be at least 2 letters.')
    }
}

export * as EmailErrors from './email.exceptions'
