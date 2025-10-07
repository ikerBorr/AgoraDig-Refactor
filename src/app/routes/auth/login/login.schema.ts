import { z } from 'zod'

export const loginSchema = z.object({
    identifier: z
        .string()
        .nonempty('Identifier is required')
        .min(3, { message: 'Identifier must be at least 3 characters long' })
        .max(50, { message: 'Identifier must be at most 50 characters long' }),

    password: z
        .string()
        .nonempty('Password is required')
        .min(6, { message: 'Password must be at least 6 characters long' })
        .max(100, { message: 'Password must be at most 100 characters long' }),
})
