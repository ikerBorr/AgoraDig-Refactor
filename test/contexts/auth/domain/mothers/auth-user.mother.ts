import { AuthUser } from '@/contexts/auth/domain/entities/auth-user'
import { Password } from '@/contexts/auth/domain/value-objects/password'

export class AuthUserMother {
    static withIdentifier(
        identifierValue: string,
        opts?: { plainPassword?: string; banned?: boolean; uuid?: string },
    ): AuthUser {
        return AuthUser.fromPrimitives({
            accountUuid: opts?.uuid ?? crypto.randomUUID(),
            identifier: identifierValue,
            password: Password.fromPlain(opts?.plainPassword ?? 'Aa1!StrongPass').value,
            banned: opts?.banned ?? false,
        })
    }
}
