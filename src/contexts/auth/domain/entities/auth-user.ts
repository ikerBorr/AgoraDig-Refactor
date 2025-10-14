import { AggregateRoot } from '@/contexts/shared-kernel/domain/entities/aggregate-root'
import { Uuid } from '@/contexts/shared-kernel/domain/value-objects/uuid'
import { Identifier } from '@/contexts/auth/domain/value-objects/identifier'
import { Password } from '@/contexts/auth/domain/value-objects/password'

export interface AuthUserPrimitives {
    uuid: string
    identifier: string
    password: string
    banned: boolean
}

export class AuthUser extends AggregateRoot {
    private constructor(
        readonly uuid: Uuid,
        readonly identifier: Identifier,
        readonly password: Password,
        readonly banned: boolean = false,
    ) {
        super()
    }

    static create(identifier: string, password: string): AuthUser {
        return new AuthUser(
            Uuid.random(),
            Identifier.from(identifier),
            Password.fromPlain(password),
        )
    }

    static fromPrimitives(primitives: AuthUserPrimitives): AuthUser {
        return new AuthUser(
            new Uuid(primitives.uuid),
            Identifier.from(primitives.identifier),
            Password.fromHash(primitives.password),
            primitives.banned,
        )
    }

    toPrimitives(): AuthUserPrimitives {
        return {
            uuid: this.uuid.value,
            identifier: this.identifier.value,
            password: this.password.value,
            banned: this.banned,
        }
    }
}
