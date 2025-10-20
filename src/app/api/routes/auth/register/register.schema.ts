import { z } from 'zod'

export const registerSchema = z.object({
    identifier: z.string().nonempty('Identifier is required'),
    password: z.string().nonempty('Password is required'),
})
