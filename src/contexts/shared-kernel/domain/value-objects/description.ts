import { ValueObject } from '@/contexts/shared-kernel/domain/value-objects/value-object'
import { DescriptionErrors } from '@/contexts/shared-kernel/domain/exceptions/description.exception'

export class Description extends ValueObject<string> {
    constructor(value: string) {
        super(value.trim())
        this.ensureIsValid(this.value)
    }

    private ensureIsValid(value: string): void {
        if (value.length > 500) {
            throw new DescriptionErrors.DescriptionTooLongError(500, value.length)
        }
    }
}
