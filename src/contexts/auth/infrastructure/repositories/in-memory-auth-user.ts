import type { AuthUserRepository } from '@/contexts/auth/domain/ports/auth-user.repository'
import { AuthUser } from '@/contexts/auth/domain/entities/auth-user'
import { Uuid } from '@/contexts/shared-kernel/domain/value-objects/uuid'
import { Password } from '@/contexts/auth/domain/value-objects/password'
import type { Identifier } from '@/contexts/auth/domain/value-objects/identifier'
import type { Nullable } from '@/contexts/shared-kernel/application/types/nullable'

export class InMemoryAuthUserRepository implements AuthUserRepository {
    private readonly users: AuthUser[] = [
        AuthUser.fromPrimitives({
            accountUuid: Uuid.random().value,
            identifier: 'john.doe@example.com',
            password: Password.fromPlain('Password123!').value, // hashed on init
            banned: false,
        }),
        AuthUser.fromPrimitives({
            accountUuid: Uuid.random().value,
            identifier: 'jane_smith',
            password: Password.fromPlain('SecurePass!9').value,
            banned: false,
        }),
        AuthUser.fromPrimitives({
            accountUuid: Uuid.random().value,
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
