import type { AuthUser } from '@/contexts/auth/domain/entities/auth-user'
import { Uuid } from '@/contexts/shared-kernel/domain/value-objects/uuid'
import { Identifier } from '@/contexts/auth/domain/value-objects/identifier'
import { Password } from '@/contexts/auth/domain/value-objects/password'

export class AuthUserMother {
    static withIdentifier(
        identifierValue: string,
        opts?: { plainPassword?: string; banned?: boolean; uuid?: string },
    ): AuthUser {
        const uuid = opts?.uuid ? new Uuid(opts.uuid) : Uuid.random()
        const identifier = Identifier.from(identifierValue)
        const password = Password.fromPlain(opts?.plainPassword ?? 'Aa1!StrongPass')
        const banned = opts?.banned ?? false

        return {
            uuid,
            identifier,
            password,
            banned,
        } as AuthUser
    }
}
