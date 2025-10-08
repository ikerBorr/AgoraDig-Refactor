import { SignJWT } from 'jose'
import type { JwtGenerator } from '@/contexts/auth/domain/ports/jwt-generator'

export class JoseJwtGeneratorService implements JwtGenerator {
    constructor(
        private readonly secret: Uint8Array = new TextEncoder().encode(process.env.JWT_SECRET),
        private readonly expiration: string = process.env.JWT_EXPIRATION ?? '1h',
    ) {
        if (!process.env.JWT_SECRET) {
            throw new Error('Missing JWT secret')
        }
    }

    async execute(params: object): Promise<string> {
        return await new SignJWT({ ...params })
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .setIssuedAt()
            .setExpirationTime(this.expiration)
            .sign(this.secret)
    }
}
