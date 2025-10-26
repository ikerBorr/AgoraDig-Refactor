import type express from 'express'
import { loginSchema } from '@/app/api/routes/auth/login/login.schema'
import type { LoginAuthUserCase } from '@/contexts/auth/application/use-cases/login-auth-user.case'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/symbols'
import { zodErrorFormatter } from '@/app/api/serialization/zod-error-formatter'
import { createSessionCookie } from '@/app/api/serialization/express-cookies'
import type { LoginCommand } from '@/contexts/auth/application/commands/login.command'
import { ApiContainer } from '@/app/api/container'

export async function POST(req: express.Request, res: express.Response) {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
        return res
            .status(400)
            .json({ code: 'VALIDATION_ERROR', message: zodErrorFormatter(parsed.error) })
    }

    const loginCommand: LoginCommand = parsed.data
    const useCase = (await ApiContainer.container()).get<LoginAuthUserCase>(
        AUTH_CONTAINER.LoginCase,
    )

    const { accessToken, user } = await useCase.execute(loginCommand)

    createSessionCookie(res, accessToken)

    return res.status(200).json({
        code: 'USER_LOGGED_IN',
        message: 'Login successful',
        data: user,
    })
}
