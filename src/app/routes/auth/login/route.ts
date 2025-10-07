import type express from 'express'
import { loginSchema } from '@/app/routes/auth/login/login.schema'
import { AuthContainer } from '@/contexts/auth/infrastructure/di/inversify.container'
import type { LoginCase } from '@/contexts/auth/application/use-cases/login.case'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/types'
import { DomainException } from '@/contexts/shared/domain/exceptions/domain.exception'
import { ApplicationException } from '@/contexts/shared/application/exceptions/application.exception'
import { InvalidCredentialsError } from '@/contexts/auth/application/exceptions/login.exceptions'

export async function POST(req: express.Request, res: express.Response) {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
        return res.status(400).json({ code: 'VALIDATION_ERROR', message: parsed.error.issues })
    }

    try {
        const { identifier, password } = parsed.data

        const user = await AuthContainer.get<LoginCase>(AUTH_CONTAINER.LoginCase).login(
            identifier,
            password,
        )

        return res.json(user)
    } catch (error) {
        if (error instanceof DomainException) {
            return res.status(422).json({ code: error.name, message: error.message })
        } else if (error instanceof ApplicationException) {
            if (error instanceof InvalidCredentialsError) {
                return res.status(401).json({ code: error.name, message: error.message })
            }
            return res.status(409).json({ code: error.name, message: error.message })
        }
        return res.status(500).json({ code: 500, message: 'Internal Server Error' })
    }
}
