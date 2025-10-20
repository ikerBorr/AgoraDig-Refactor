import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify'
import type { AuthUserRepository } from '@/contexts/auth/domain/ports/auth-user.repository'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/symbols'
import { InMemoryAuthUserRepository } from '@/contexts/auth/infrastructure/repositories/in-memory-auth-user'
import { LoginCase } from '@/contexts/auth/application/use-cases/login.case'
import type { JwtGenerator } from '@/contexts/auth/domain/ports/jwt-generator'
import { JoseJwtGeneratorService } from '@/contexts/auth/infrastructure/services/jose-jwt-generator.service'
import { RegisterCase } from '@/contexts/auth/application/use-cases/register.case'

export const AuthModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
    options
        .bind<AuthUserRepository>(AUTH_CONTAINER.AuthUserRepository)
        .to(InMemoryAuthUserRepository)

    options.bind<JwtGenerator>(AUTH_CONTAINER.JwtGenerator).to(JoseJwtGeneratorService)

    options.bind<LoginCase>(AUTH_CONTAINER.LoginCase).to(LoginCase)
    options.bind<RegisterCase>(AUTH_CONTAINER.RegisterCase).to(RegisterCase)
})
