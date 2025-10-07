import {ValueObject} from "@/contexts/shared/domain/value-objects/value-object";
import { UsernameErrors } from "@/contexts/shared/domain/exceptions/username.exceptions";

const USERNAME_MIN_LENGTH = 3
const USERNAME_MAX_LENGTH = 20

export class Username extends ValueObject<string> {
    constructor(value: string) {
        super(value)
        this.ensureIsValid(value)
    }

    private ensureIsValid(value: string): void {
        const trimmed = value.trim()

        if (trimmed.length < USERNAME_MIN_LENGTH || trimmed.length > USERNAME_MAX_LENGTH) {
            throw new UsernameErrors.UsernameLengthOutOfRangeError(
                USERNAME_MIN_LENGTH,
                USERNAME_MAX_LENGTH,
                trimmed.length,
            )
        }

        const validUsernameRegex = /^[a-zA-Z0-9._]+$/
        if (!validUsernameRegex.test(trimmed)) {
            throw new UsernameErrors.UsernameInvalidCharactersError()
        }
    }
}
