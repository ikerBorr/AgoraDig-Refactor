import type { DomainException } from '@/contexts/shared/domain/exceptions/domain.exception'
import type { ApplicationException } from '@/contexts/shared/application/exceptions/application.exception'

export interface HttpResponse {
    code: string
    message: string
}

export type Exception = DomainException | ApplicationException
