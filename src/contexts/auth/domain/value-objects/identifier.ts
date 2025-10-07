import {ValueObject} from "@/contexts/shared/domain/value-objects/value-object";
import {Email} from "@/contexts/shared/domain/value-objects/email";
import {Username} from "@/contexts/shared/domain/value-objects/username";

export class Identifier extends ValueObject<string> {
    private constructor(
        value: string,
        private readonly _isEmail: boolean,
    ) {
        super(value)
    }

    static from(value: string): Identifier {
        const trimmed = value.trim()
        const isEmail = trimmed.includes('@')

        return new Identifier(
            isEmail ? new Email(trimmed).value : new Username(trimmed).value,
            isEmail,
        )
    }

    get isEmail(): boolean {
        return this._isEmail
    }

    get isUsername(): boolean {
        return this._isEmail
    }
}
