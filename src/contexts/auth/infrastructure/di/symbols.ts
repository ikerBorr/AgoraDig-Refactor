export const AUTH_CONTAINER = {
    AuthUserRepository: Symbol.for('Auth.AuthUserRepository'),
    RegistrationFlowRepository: Symbol.for('Auth.RegistrationFlowRepository'),
    JwtGenerator: Symbol.for('Auth.JwtGenerator'),
    LoginCase: Symbol.for('Auth.LoginCase'),
    RegisterCase: Symbol.for('Auth.RegisterCase'),
}
