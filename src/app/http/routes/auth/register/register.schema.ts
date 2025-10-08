import { z } from 'zod'

export const registerSchema = z.object({
    firstName: z
        .string()
        .nonempty('First name is required')
        .min(2, { message: 'First name must be at least 2 characters long' })
        .max(50, { message: 'First name must be at most 50 characters long' }),

    lastName: z
        .string()
        .nonempty('Last name is required')
        .min(2, { message: 'Last name must be at least 2 characters long' })
        .max(50, { message: 'Last name must be at most 50 characters long' }),

    dateOfBirth: z
        .string()
        .nonempty('Date of birth is required')
        .refine((value) => !isNaN(Date.parse(value)), {
            message: 'Date of birth must be a valid date',
        }),

    username: z
        .string()
        .nonempty('Username is required')
        .min(3, { message: 'Username must be at least 3 characters long' })
        .max(30, { message: 'Username must be at most 30 characters long' }),

    email: z.string().nonempty('Email is required'),
    password: z
        .string()
        .nonempty('Password is required')
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(100, { message: 'Password must be at most 100 characters long' }),
    description: z
        .string()
        .max(500, { message: 'Description must be at most 500 characters long' })
        .optional(),

    acceptsPublicity: z.boolean().optional(),
})
