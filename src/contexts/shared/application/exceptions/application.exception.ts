import type { ApplicationExceptionCode } from '@/contexts/shared/application/exceptions/application-code.exception'

export abstract class ApplicationException extends Error {
    abstract override readonly name: string
    abstract readonly code: ApplicationExceptionCode

    protected constructor(message: string) {
        super(message)
    }
}
