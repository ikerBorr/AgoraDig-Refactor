import { ValueObject } from '@/contexts/shared-kernel/domain/value-objects/value-object'
import { LastNameErrors } from '@/contexts/shared-kernel/domain/exceptions/last-name.exeption'

export class LastName extends ValueObject<string> {
    constructor(value: string) {
        super(value.trim())
        this.ensureIsValid(this.value)
    }

    private ensureIsValid(value: string): void {
        if (value.length < 2 || value.length > 50) {
            throw new LastNameErrors.LastNameLengthOutOfRangeError(2, 50, value.length)
        }

        if (!/^[a-zA-ZÀ-ÿ' -]+$/.test(value)) {
            throw new LastNameErrors.LastNameInvalidCharactersError()
        }
    }
}
