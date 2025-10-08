import type express from "express";
import type {Exception} from "@/app/http/serialization/http-exception-mapper";
import {registerSchema} from "@/app/http/routes/auth/register/register.schema";
import {registerErrorMapper} from "@/app/http/routes/auth/register/register.error-mapper";
import {zodErrorFormatter} from "@/app/http/serialization/zod-error-formatter";

export function POST(req: express.Request, res: express.Response) {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
        return res
            .status(400)
            .json({ code: 'VALIDATION_ERROR', message: zodErrorFormatter(parsed.error) })
    }

    try {
        const data = parsed.data

        console.log(data)


        return res.status(200).json({ code: 'SUCCESS', message: 'Login successful' })
    } catch (error) {
        console.error(error)
        const { status, response } = registerErrorMapper(error as Exception)
        return res.status(status).json(response)
    }
}