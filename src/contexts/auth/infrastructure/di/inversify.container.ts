import { Container } from 'inversify'
import { SharedContainer } from '@/contexts/shared/infrastructure/di/inversify.container'
import type { AuthUserRepository } from '@/contexts/auth/domain/ports/auth-user.repository'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/types'
import { InMemoryAuthUserRepository } from '@/contexts/auth/infrastructure/repositories/in-memory-auth-user'
import { LoginCase } from '@/contexts/auth/application/use-cases/login.case'

export const AuthContainer = new Container({ parent: SharedContainer })

AuthContainer.bind<AuthUserRepository>(AUTH_CONTAINER.AuthUserRepository).to(
    InMemoryAuthUserRepository,
)

AuthContainer.bind<LoginCase>(AUTH_CONTAINER.LoginCase).to(LoginCase)
