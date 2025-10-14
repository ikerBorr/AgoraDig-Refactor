import type express from 'express'
import { AuthContainer } from '@/contexts/auth/infrastructure/di/inversify.container'
import type { JwtGenerator } from '@/contexts/auth/domain/ports/jwt-generator'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/types'
import type { Nullable } from '@/contexts/shared-kernel/application/types/nullable'
import type { DecodedSessionCookieDto } from '@/contexts/auth/application/dto/decoded-session-cookie.dto'

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || '__AgoraDig_Session'
const PROTECTED_PREFIXES: string[] = ['/example-of-protected-endpoint']

export async function permissionHandlerMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) {
    const user = await getUser(req.signedCookies)
    exportUser(res, user)

    if (req.path === '/' && process.env.NODE_ENV === 'development') {
        return res.redirect('/api/docs')
    }

    if (isProtectedEndpoint(req.path) && !user) {
        return res
            .status(401)
            .json({ code: 'UNAUTHORIZED', message: 'Session cookie missing or invalid' })
    }

    if (user && req.path.includes('login')) {
        return res
            .status(409)
            .json({ code: 'ALREADY_AUTHENTICATED', message: 'You already have an active session.' })
    }

    next()
}

function isProtectedEndpoint(pathname: string): boolean {
    return PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
}

async function getUser(
    signedCookies: Record<string, string> | undefined,
): Promise<Nullable<DecodedSessionCookieDto>> {
    if (!signedCookies) return null

    const session = signedCookies[COOKIE_NAME]
    if (!session) return null

    try {
        const jwt = AuthContainer.get<JwtGenerator>(AUTH_CONTAINER.JwtGenerator)
        const { uuid, identifier, banned } = await jwt.decode<DecodedSessionCookieDto>(session)

        return { uuid, banned, identifier }
    } catch {
        return null
    }
}

function exportUser(res: express.Response, user: Nullable<DecodedSessionCookieDto>) {
    if (user) {
        res.locals.user = user
    }
}
