import type { AuthUserRepository } from '../../domain/ports/auth-user.repository'
import { AuthUser } from '../../domain/entities/auth-user'
import type { Identifier } from '../../domain/value-objects/identifier'
import type { Nullable } from '../../../shared/application/types/nullable'
import { Uuid } from '../../../shared/domain/value-objects/uuid'
import { Password } from '../../domain/value-objects/password'

export class InvalidCredentials implements AuthUserRepository {
    private readonly users: AuthUser[] = [
        AuthUser.fromPrimitives({
            uuid: Uuid.random().value,
            identifier: 'john.doe@example.com',
            password: Password.fromPlain('Password123!').value, // hashed on init
            banned: false,
        }),
        AuthUser.fromPrimitives({
            uuid: Uuid.random().value,
            identifier: 'jane_smith',
            password: Password.fromPlain('SecurePass!9').value,
            banned: false,
        }),
        AuthUser.fromPrimitives({
            uuid: Uuid.random().value,
            identifier: 'banned.user@example.com',
            password: Password.fromPlain('ValidPass1!').value,
            banned: true,
        }),
    ]

    async save(user: AuthUser): Promise<void> {
        const index = this.users.findIndex((u) => u.identifier.value === user.identifier.value)

        if (index >= 0) {
            this.users[index] = user
        } else {
            this.users.push(user)
        }
    }

    async searchByIdentifier(identifier: Identifier): Promise<Nullable<AuthUser>> {
        return this.users.find((u) => u.identifier.value === identifier.value) ?? null
    }
}
