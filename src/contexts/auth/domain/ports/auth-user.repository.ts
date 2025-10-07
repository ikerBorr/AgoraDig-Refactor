import type { AuthUser } from '../entities/auth-user'
import type { Nullable } from '../../../shared/application/types/nullable'
import type { Identifier } from '../value-objects/identifier'

export interface AuthUserRepository {
    save(user: AuthUser): Promise<void>
    searchByIdentifier(identifier: Identifier): Promise<Nullable<AuthUser>>
}
