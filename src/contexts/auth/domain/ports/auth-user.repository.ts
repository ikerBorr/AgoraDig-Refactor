import type {AuthUser} from "@/contexts/auth/domain/entities/auth-user";
import type {Identifier} from "@/contexts/auth/domain/value-objects/identifier";
import type {Nullable} from "@/contexts/shared/application/types/nullable";

export interface AuthUserRepository {
    save(user: AuthUser): Promise<void>
    searchByIdentifier(identifier: Identifier): Promise<Nullable<AuthUser>>
}
