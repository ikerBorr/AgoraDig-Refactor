import { ApplicationException } from '@/contexts/shared-kernel/application/exceptions/application.exception'
import { ApplicationExceptionCode } from '@/contexts/shared-kernel/application/exceptions/application-code.exception'

export class InvalidCredentialsError extends ApplicationException {
    readonly name = 'INVALID_CREDENTIALS'
    readonly code = ApplicationExceptionCode.INVALID_INPUT

    constructor() {
        super('Invalid credentials')
    }
}

export class UserBannedError extends ApplicationException {
    readonly name = 'USER_BANNED'
    readonly code = ApplicationExceptionCode.OPERATION_NOT_ALLOWED

    constructor() {
        super('User has been banned')
    }
}

export * as LoginErrors from './login.exceptions'
