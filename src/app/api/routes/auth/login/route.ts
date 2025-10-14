import type express from 'express'
import { loginSchema } from '@/app/api/routes/auth/login/login.schema'
import { AuthContainer } from '@/contexts/auth/infrastructure/di/inversify.container'
import type { LoginCase } from '@/contexts/auth/application/use-cases/login.case'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/types'
import { zodErrorFormatter } from '@/app/api/serialization/zod-error-formatter'
import { createSessionCookie } from '@/app/api/serialization/express-cookies'
import type { LoginCommand } from '@/contexts/auth/application/commands/login.command'

export async function POST(req: express.Request, res: express.Response) {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
        return res
            .status(400)
            .json({ code: 'VALIDATION_ERROR', message: zodErrorFormatter(parsed.error) })
    }

    const loginCommand: LoginCommand = parsed.data

    const token = await AuthContainer.get<LoginCase>(AUTH_CONTAINER.LoginCase).execute(loginCommand)

    createSessionCookie(res, token)

    return res.status(200).json({ code: 'SUCCESS', message: 'Login successful' })
}
