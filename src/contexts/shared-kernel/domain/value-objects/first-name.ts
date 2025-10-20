import { ValueObject } from '@/contexts/shared-kernel/domain/value-objects/value-object'
import { FirstNameErrors } from '@/contexts/shared-kernel/domain/exceptions/first-name.exception'

export class FirstName extends ValueObject<string> {
    constructor(value: string) {
        super(value.trim())
        this.ensureIsValid(this.value)
    }

    private ensureIsValid(value: string): void {
        if (value.length < 2 || value.length > 50) {
            throw new FirstNameErrors.FirstNameLengthOutOfRangeError(2, 50, value.length)
        }

        if (!/^[a-zA-ZÀ-ÿ' -]+$/.test(value)) {
            throw new FirstNameErrors.FirstNameInvalidCharactersError()
        }
    }
}
