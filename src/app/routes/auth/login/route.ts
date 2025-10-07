import type express from 'express'
import {loginSchema} from "@/app/routes/auth/login/login.schema";

export function POST(req: express.Request, res: express.Response) {
    const result = loginSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).send(result.error.issues)
    }

    try {
        const { identifier, password } = result.data

        console.log(`Username: ${identifier}; Password: ${password}`)

        return res.json('ok')
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message })
    }
}
