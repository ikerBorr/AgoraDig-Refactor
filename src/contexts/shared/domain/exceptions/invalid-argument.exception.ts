import {DomainException} from "@/contexts/shared/domain/exceptions/domain.exception";

export class InvalidArgumentError extends DomainException {
    readonly name = 'INVALID_ARGUMENT_ERROR'
    constructor(message: string) {
        super(message)
    }
}
