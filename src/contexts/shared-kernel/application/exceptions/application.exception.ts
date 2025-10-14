import { Exception } from '@/libs/exception/exception'
import type { ApplicationExceptionCode } from '@/contexts/shared-kernel/application/exceptions/application-code.exception'

export abstract class ApplicationException extends Exception<ApplicationExceptionCode> {
    protected constructor(message: string) {
        super(message)
    }
}
