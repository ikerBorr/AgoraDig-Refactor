import { faker } from '@faker-js/faker'
import { Identifier } from '../../../../../src/contexts/auth/domain/value-objects/identifier'

export class IdentifierMother {
    static randomEmail(): Identifier {
        return Identifier.from(faker.internet.email().toLowerCase())
    }
    static randomUsername(): Identifier {
        const username = faker.internet
            .username()
            .replace(/[^a-zA-Z0-9._]/g, '')
            .slice(0, 16)
        return Identifier.from(username)
    }
    static random(): Identifier {
        return Math.random() > 0.5 ? this.randomEmail() : this.randomUsername()
    }
}
