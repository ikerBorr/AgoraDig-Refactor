import type express from 'express'
import { registerSchema } from '@/app/http/routes/auth/register/register.schema'
import { zodErrorFormatter } from '@/app/http/serialization/zod-error-formatter'

export function POST(req: express.Request, res: express.Response) {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
        return res
            .status(400)
            .json({ code: 'VALIDATION_ERROR', message: zodErrorFormatter(parsed.error) })
    }

    const data = parsed.data

    console.log(data)

    return res.status(200).json({ code: 'SUCCESS', message: 'Login successful' })
}
