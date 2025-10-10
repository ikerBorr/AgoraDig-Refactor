import type { DomainEvent } from '@/contexts/shared/domain/entities/domain-event'
import type { DomainEventSubscriber } from '@/contexts/shared/domain/ports/domain-event-subscriber'

export interface EventBus {
    publish(events: Array<DomainEvent<unknown>>): Promise<void>
    addSubscribers(subscribers: Array<DomainEventSubscriber<DomainEvent<undefined>>>): void
}
