import { ValueObject } from '@/contexts/shared-kernel/domain/value-objects/value-object'
import { BirthDateErrors } from '@/contexts/forum/member/domain/exceptions/birth-date.exceptions'

export class BirthDate extends ValueObject<number> {
    constructor(value: number) {
        super(value)
        this.ensureIsValid(value)
    }

    private ensureIsValid(value: number): void {
        const date = new Date(value)

        const today = new Date()
        const now = today.getTime()

        if (date.getTime() >= now) {
            throw new BirthDateErrors.BirthDateInFutureError()
        }
    }

    public toDate(): Date {
        return new Date(this.value)
    }
}
