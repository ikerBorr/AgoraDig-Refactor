import { faker } from '@faker-js/faker'
import { Password } from '@/contexts/auth/domain/value-objects/password'

export class PasswordMother {
    static strongPlain(): string {
        const base = faker.internet.password({ length: 10, memorable: false })
        return `Aa1!${base.replace(/[^a-zA-Z0-9]/g, '')}`
    }

    static fromPlain(plain?: string): Password {
        const p = plain ?? this.strongPlain()
        return Password.fromPlain(p)
    }
}
