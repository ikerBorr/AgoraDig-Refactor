import EventEmitter from 'node:events'
import { injectable } from 'inversify'
import type { EventBus } from '@/contexts/shared-kernel/domain/ports/event-bus'
import type { DomainEvent } from '@/contexts/shared-kernel/domain/entities/domain-event'
import type { DomainEventSubscriber } from '@/contexts/shared-kernel/domain/ports/domain-event-subscriber'

@injectable()
export class MemAsyncEventBus extends EventEmitter implements EventBus {
    public async publish(events: DomainEvent<unknown>[]) {
        for (const event of events) {
            this.emit(event.eventName, event)
        }
    }

    addSubscribers(subscribers: Array<DomainEventSubscriber<DomainEvent<undefined>>>) {
        for (const subscriber of subscribers) {
            for (const event of subscriber.subscribedTo()) {
                this.on(event.EVENT_NAME, subscriber.on.bind(subscriber))
            }
        }
    }
}
