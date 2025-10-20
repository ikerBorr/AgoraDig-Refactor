import type express from 'express'
import { registerSchema } from '@/app/api/routes/auth/register/register.schema'
import { zodErrorFormatter } from '@/app/api/serialization/zod-error-formatter'
import type { RegisterCommand } from '@/contexts/auth/application/commands/register.command'
import { ApiContainer } from '@/app/api/container'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/symbols'
import type { RegisterCase } from '@/contexts/auth/application/use-cases/register.case'

export async function POST(req: express.Request, res: express.Response) {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
        return res
            .status(400)
            .json({ code: 'VALIDATION_ERROR', message: zodErrorFormatter(parsed.error) })
    }

    const registerCommand: RegisterCommand = parsed.data
    const useCase = (await ApiContainer.container()).get<RegisterCase>(AUTH_CONTAINER.RegisterCase)

    const user = await useCase.execute(registerCommand)

    return res.status(201).json({
        code: 'USER_REGISTERED',
        message: 'User registered successfully',
        data: user,
    })
}
