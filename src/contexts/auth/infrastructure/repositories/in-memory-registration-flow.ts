import { Uuid } from '@/contexts/shared-kernel/domain/value-objects/uuid'
import type { RegistrationFlowRepository } from '@/contexts/auth/domain/ports/registration-flow.repository'
import { Identifier } from '@/contexts/auth/domain/value-objects/identifier'

export class InMemoryRegistrationFlow implements RegistrationFlowRepository {
    async save(identifier: Identifier, expireIn: Date): Promise<Uuid> {
        console.log(`identifier: ${identifier}, expireIn: ${expireIn}`)
        return Uuid.random()
    }

    async find(flow: Uuid): Promise<Identifier> {
        console.log(`Flow: ${flow}`)
        return Identifier.from('in-memory-example@gmail.com')
    }
}
