import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify'
import type { AuthUserRepository } from '@/contexts/auth/domain/ports/auth-user.repository'
import { AUTH_CONTAINER } from '@/contexts/auth/infrastructure/di/symbols'
import { InMemoryAuthUserRepository } from '@/contexts/auth/infrastructure/repositories/in-memory-auth-user'
import { LoginAuthUserCase } from '@/contexts/auth/application/use-cases/login-auth-user.case'
import type { JwtGenerator } from '@/contexts/auth/domain/ports/jwt-generator'
import { JoseJwtGeneratorService } from '@/contexts/auth/infrastructure/services/jose-jwt-generator.service'
import { RegisterAuthUserCase } from '@/contexts/auth/application/use-cases/register-auth-user.case'
import { InMemoryRegistrationFlow } from '@/contexts/auth/infrastructure/repositories/in-memory-registration-flow'
import type { RegistrationFlowRepository } from '@/contexts/auth/domain/ports/registration-flow.repository'

export const AuthModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
    options
        .bind<AuthUserRepository>(AUTH_CONTAINER.AuthUserRepository)
        .to(InMemoryAuthUserRepository)

    options
        .bind<RegistrationFlowRepository>(AUTH_CONTAINER.RegistrationFlowRepository)
        .to(InMemoryRegistrationFlow)

    options.bind<JwtGenerator>(AUTH_CONTAINER.JwtGenerator).to(JoseJwtGeneratorService)

    options.bind<LoginAuthUserCase>(AUTH_CONTAINER.LoginCase).to(LoginAuthUserCase)
    options.bind<RegisterAuthUserCase>(AUTH_CONTAINER.RegisterCase).to(RegisterAuthUserCase)
})
