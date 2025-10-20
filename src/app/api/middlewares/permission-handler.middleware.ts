import type express from 'express'
import type { JwtGenerator } from '@/contexts/auth/domain/ports/jwt-generator'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/symbols'
import { ApiContainer } from '@/app/api/container'
import type { AuthUserPrimitives } from '@/contexts/auth/domain/entities/auth-user'

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

async function getUser(signedCookies: Record<string, string> | undefined) {
    if (!signedCookies) return null

    const session = signedCookies[COOKIE_NAME]
    if (!session) return null

    try {
        const jwt = (await ApiContainer.container()).get<JwtGenerator>(AUTH_CONTAINER.JwtGenerator)
        const { accountUuid, identifier, banned } = await jwt.decode<AuthUserPrimitives>(session)

        return { accountUuid, banned, identifier }
    } catch {
        return null
    }
}

function exportUser<T>(res: express.Response, user: T) {
    if (user) {
        res.locals.user = user
    }
}
