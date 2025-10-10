import type { Request, Response, NextFunction } from 'express'
import { DomainException } from '@/contexts/shared/domain/exceptions/domain.exception'
import { ApplicationException } from '@/contexts/shared/application/exceptions/application.exception'
import { DomainExceptionCode } from '@/contexts/shared/domain/exceptions/domain-code.exception'
import { ApplicationExceptionCode } from '@/contexts/shared/application/exceptions/application-code.exception'
import type { Exception } from '@/libs/exception/exception'

export function errorHandlerMiddleware(
    err: Exception<unknown>,
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    if (res.headersSent) {
        return next(err)
    }

    console.error('[ERROR]', err)

    const status = (() => {
        if (err instanceof DomainException) return mapDomainException(err.code)
        if (err instanceof ApplicationException) return mapApplicationException(err.code)
        return 500
    })()

    return res.status(status).json(err.toPrimitives())
}

function mapDomainException(code: DomainExceptionCode): number {
    switch (code) {
        case DomainExceptionCode.INVARIANT_VIOLATION:
        case DomainExceptionCode.BUSINESS_RULE_VIOLATION:
        case DomainExceptionCode.PRECONDITION_FAILED:
        case DomainExceptionCode.SPECIFICATION_NOT_SATISFIED:
            return 422
        case DomainExceptionCode.STATE_CONFLICT:
        case DomainExceptionCode.ALREADY_EXISTS:
        case DomainExceptionCode.CONCURRENCY_CONFLICT:
            return 409
        case DomainExceptionCode.NOT_FOUND:
            return 404
        case DomainExceptionCode.LIMIT_EXCEEDED:
            return 429
        default:
            return 500
    }
}

function mapApplicationException(code: ApplicationExceptionCode): number {
    switch (code) {
        case ApplicationExceptionCode.INVALID_INPUT:
        case ApplicationExceptionCode.VALIDATION_ERROR:
            return 400
        case ApplicationExceptionCode.RESOURCE_NOT_FOUND:
            return 404
        case ApplicationExceptionCode.CONCURRENCY_CONFLICT:
        case ApplicationExceptionCode.DUPLICATE_REQUEST:
            return 409
        case ApplicationExceptionCode.OPERATION_NOT_ALLOWED:
            return 403
        case ApplicationExceptionCode.DEPENDENCY_FAILURE:
            return 502
        case ApplicationExceptionCode.TIMEOUT:
            return 504
        case ApplicationExceptionCode.INTERNAL_ERROR:
        default:
            return 500
    }
}
