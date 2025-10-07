import { ValueObject } from './value-object'
import { UuidErrors } from '../exceptions/uuid.exceptions'

export class Uuid extends ValueObject<string> {
    constructor(value?: string) {
        const id = value ?? crypto.randomUUID()
        super(id)
        this.ensureIsValidUuid(id)
    }

    private ensureIsValidUuid(value: string): void {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(value)) {
            throw new UuidErrors.UuidInvalidFormatError(value)
        }
    }

    static random(): Uuid {
        return new Uuid(crypto.randomUUID())
    }

    static fromPrimitive(value: string): Uuid {
        return new Uuid(value)
    }
}
