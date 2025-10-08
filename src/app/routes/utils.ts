import type express from 'express'
import type { z } from 'zod'

export function createSessionCookie(res: express.Response, token: string) {
    res.cookie(process.env.SESSION_COOKIE_NAME || 'session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: Number(process.env.SESSION_COOKIE_EXPIRATION) || 86400000,
        signed: true,
    })
}

export function formatZodError(error: z.ZodError): string {
    if (!error?.issues?.length) {
        return 'Invalid request body.'
    }

    const fields = Array.from(new Set(error.issues.map((i) => i.path.join('.') || 'field')))

    const fieldList =
        fields.length === 1
            ? fields[0]
            : `${fields.slice(0, -1).join(', ')} and ${fields[fields.length - 1]}`

    return `The ${fieldList} ${fields.length > 1 ? 'are' : 'is'} invalid input.`
}
