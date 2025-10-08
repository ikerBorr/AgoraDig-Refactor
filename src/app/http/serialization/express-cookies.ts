import type express from "express";

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