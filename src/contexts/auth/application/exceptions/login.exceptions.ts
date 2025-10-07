import { ApplicationException } from '../../../shared/application/exceptions/application.exception'

export class InvalidCredentialsError extends ApplicationException {
    readonly name = 'INVALID_CREDENTIALS'
    constructor() {
        super('Invalid credentials')
    }
}

export class UserBannedError extends ApplicationException {
    readonly name = 'USER_BANNED'
    constructor() {
        super('User has been banned')
    }
}

export * as LoginErrors from './login.exceptions'
