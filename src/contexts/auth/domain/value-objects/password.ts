import { ValueObject } from '@/contexts/shared-kernel/domain/value-objects/value-object'
import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto'
import { PasswordErrors } from '@/contexts/auth/domain/exceptions/password.exceptions'

export class Password extends ValueObject<string> {
    private static readonly ITERATIONS = 310000
    private static readonly KEY_LENGTH = 32
    private static readonly DIGEST = 'sha256'

    private constructor(hash: string) {
        super(hash)
    }

    static fromPlain(plain: string): Password {
        this.ensureIsSecure(plain)
        const salt = randomBytes(16)
        const derivedKey = pbkdf2Sync(plain, salt, this.ITERATIONS, this.KEY_LENGTH, this.DIGEST)
        const hash = `${this.ITERATIONS}$${salt.toString('hex')}$${derivedKey.toString('hex')}`
        return new Password(hash)
    }

    static fromHash(hash: string): Password {
        if (!this.isValidHashFormat(hash)) {
            throw new PasswordErrors.PasswordHashFormatInvalidError()
        }
        return new Password(hash)
    }

    matches(plain: string): boolean {
        const [iterationsStr, saltHex, storedHex] = this.value.split('$')
        const iterations = parseInt(iterationsStr!, 10)
        const salt = Buffer.from(saltHex!, 'hex')
        const storedKey = Buffer.from(storedHex!, 'hex')

        const derivedKey = pbkdf2Sync(plain, salt, iterations, storedKey.length, Password.DIGEST)

        return timingSafeEqual(storedKey, derivedKey)
    }

    assertMatches(plain: string): void {
        if (!this.matches(plain)) {
            throw new PasswordErrors.PasswordMismatchError()
        }
    }

    private static isValidHashFormat(value: string): boolean {
        return /^\d+\$[a-f0-9]+\$[a-f0-9]+$/.test(value)
    }

    private static ensureIsSecure(value: string): void {
        if (value.length < 8) {
            throw new PasswordErrors.PasswordTooShortError(8, value.length)
        }

        const hasUppercase = /[A-Z]/.test(value)
        const hasLowercase = /[a-z]/.test(value)
        const hasNumber = /\d/.test(value)
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value)

        if (!hasUppercase || !hasLowercase || !hasNumber || !hasSymbol) {
            throw new PasswordErrors.PasswordComplexityNotMetError()
        }
    }
}
