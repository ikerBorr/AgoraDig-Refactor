import type { Nullable } from '@/contexts/shared/application/types/nullable'

export interface RegisterRequestDto {
    firstName: string
    lastName: string
    dateOfBirth: string
    username: string
    email: string
    password: string
    description: Nullable<string>
    acceptsPublicity: Nullable<boolean>
}
