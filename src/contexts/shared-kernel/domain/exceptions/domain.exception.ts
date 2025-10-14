import { Exception } from '@/libs/exception/exception'
import type { DomainExceptionCode } from '@/contexts/shared-kernel/domain/exceptions/domain-code.exception'

export abstract class DomainException extends Exception<DomainExceptionCode> {
    protected constructor(message: string) {
        super(message)
    }
}
