import type { DomainEvent, DomainEventClass } from '@/contexts/shared/domain/entities/domain-event'

export interface DomainEventSubscriber<T extends DomainEvent<undefined>> {
    subscribedTo(): Array<DomainEventClass>
    on(domainEvent: T): Promise<void>
}
