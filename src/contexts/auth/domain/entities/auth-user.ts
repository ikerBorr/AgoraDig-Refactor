import { AggregateRoot } from '@/contexts/shared-kernel/domain/entities/aggregate-root'
import { Uuid } from '@/contexts/shared-kernel/domain/value-objects/uuid'
import { Identifier } from '@/contexts/auth/domain/value-objects/identifier'
import { Password } from '@/contexts/auth/domain/value-objects/password'

interface InternalAuthUserPrimitives {
    accountUuid: string
    identifier: string
    password: string
    banned: boolean
}

export type AuthUserPrimitives = Omit<InternalAuthUserPrimitives, 'password'>

export class AuthUser extends AggregateRoot {
    private constructor(
        readonly accountUuid: Uuid,
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

    static fromPrimitives(primitives: InternalAuthUserPrimitives): AuthUser {
        return new AuthUser(
            new Uuid(primitives.accountUuid),
            Identifier.from(primitives.identifier),
            Password.fromHash(primitives.password),
            primitives.banned,
        )
    }

    toPrimitives(): AuthUserPrimitives {
        return {
            accountUuid: this.accountUuid.value,
            identifier: this.identifier.value,
            banned: this.banned,
        }
    }
}
