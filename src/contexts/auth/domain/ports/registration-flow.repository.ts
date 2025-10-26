import type { Uuid } from '@/contexts/shared-kernel/domain/value-objects/uuid'
import type { Identifier } from '@/contexts/auth/domain/value-objects/identifier'

export interface RegistrationFlowRepository {
    save(identifier: Identifier, expireIn: Date): Promise<Uuid>
    find(flow: Uuid): Promise<Identifier>
}
