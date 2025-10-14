import EventEmitter from 'events'
import { injectable } from 'inversify'
import type { EventBus } from '@/contexts/shared-kernel/domain/ports/event-bus'
import type { DomainEvent } from '@/contexts/shared-kernel/domain/entities/domain-event'
import type { DomainEventSubscriber } from '@/contexts/shared-kernel/domain/ports/domain-event-subscriber'

@injectable()
export class MemAsyncEventBus extends EventEmitter implements EventBus {
    public async publish(events: DomainEvent<unknown>[]) {
        events.map((event) => this.emit(event.eventName, event))
    }

    addSubscribers(subscribers: Array<DomainEventSubscriber<DomainEvent<undefined>>>) {
        subscribers.forEach((subscriber) => {
            subscriber.subscribedTo().forEach((event) => {
                this.on(event.EVENT_NAME, subscriber.on.bind(subscriber))
            })
        })
    }
}
