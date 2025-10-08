import type {
    Exception,
    HttpExceptionResponse,
    HttpResponse,
} from '@/app/routes/http-exception-mapper'
import { DomainException } from '@/contexts/shared/domain/exceptions/domain.exception'
import { ApplicationException } from '@/contexts/shared/application/exceptions/application.exception'
import { InvalidCredentialsError } from '@/contexts/auth/application/exceptions/login.exceptions'

export function loginErrorMapper(error: Exception): HttpExceptionResponse {
    const response: HttpResponse = { code: error.name, message: error.message }

    if (error instanceof DomainException) {
        return { status: 422, response }
    }

    if (error instanceof ApplicationException) {
        return error instanceof InvalidCredentialsError
            ? { status: 401, response }
            : { status: 409, response }
    }

    return { status: 500, response: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } }
}
