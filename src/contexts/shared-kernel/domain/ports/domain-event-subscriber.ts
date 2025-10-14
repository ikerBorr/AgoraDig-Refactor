import type {
    DomainEvent,
    DomainEventClass,
} from '@/contexts/shared-kernel/domain/entities/domain-event'

export interface DomainEventSubscriber<T extends DomainEvent<undefined>> {
    subscribedTo(): Array<DomainEventClass>
    on(domainEvent: T): Promise<void>
}
