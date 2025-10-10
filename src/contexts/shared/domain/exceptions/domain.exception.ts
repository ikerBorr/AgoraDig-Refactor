import type { DomainExceptionCode } from '@/contexts/shared/domain/exceptions/domain-code.exception'

export abstract class DomainException extends Error {
    abstract override readonly name: string
    abstract readonly code: DomainExceptionCode

    protected constructor(message: string) {
        super(message)
    }
}
