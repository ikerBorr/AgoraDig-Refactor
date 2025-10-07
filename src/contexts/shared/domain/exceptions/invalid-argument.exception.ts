import { DomainException } from './domain.exception'

export class InvalidArgumentError extends DomainException {
    readonly name = 'INVALID_ARGUMENT_ERROR'
    constructor(message: string) {
        super(message)
    }
}
