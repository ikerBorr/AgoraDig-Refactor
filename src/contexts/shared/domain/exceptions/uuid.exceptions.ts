import { DomainException } from './domain.exception'

export class UuidInvalidFormatError extends DomainException {
    readonly name = 'UUID_INVALID_FORMAT'
    constructor(value: string) {
        super(`Invalid UUID format: '${value}'`)
    }
}

export * as UuidErrors from './uuid.exceptions'
