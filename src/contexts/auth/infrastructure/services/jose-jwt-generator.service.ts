import { jwtVerify, SignJWT } from 'jose'
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

    async encode(params: object): Promise<string> {
        return await new SignJWT({ ...params })
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .setIssuedAt()
            .setExpirationTime(this.expiration)
            .sign(this.secret)
    }

    async decode<T>(session: string): Promise<T> {
        if (!session) throw new Error('Empty token')

        try {
            let raw = session
            try {
                raw = decodeURIComponent(session)
            } catch {
                /* ignore */
            }

            if (raw.startsWith('s:')) {
                const unsigned = raw.slice(2)
                const lastDot = unsigned.lastIndexOf('.')
                raw = lastDot > -1 ? unsigned.slice(0, lastDot) : unsigned
            }

            const { payload } = await jwtVerify(raw, this.secret, {
                algorithms: ['HS256'],
            })

            return payload as T
        } catch {
            throw new Error('Invalid or expired session token')
        }
    }
}
