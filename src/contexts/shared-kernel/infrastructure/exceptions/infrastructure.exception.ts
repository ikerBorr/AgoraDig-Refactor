import { Exception } from '@/libs/exception/exception'
import type { InfrastructureExceptionCode } from '@/contexts/shared-kernel/infrastructure/exceptions/infrastructure-code.exception'

export abstract class InfrastructureException extends Exception<InfrastructureExceptionCode> {
    protected constructor(message: string) {
        super(message)
    }
}
