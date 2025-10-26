import type { AuthUserCredentials } from '@/contexts/auth/domain/entities/auth-user'

export interface LoginResponseDto {
    accessToken: string
    user: AuthUserCredentials
}
