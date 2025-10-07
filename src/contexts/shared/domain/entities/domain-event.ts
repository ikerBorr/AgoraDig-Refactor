export interface DomainEventParams<T> {
    aggregateId: string
    eventId?: string
    payload: T
    occurredOn?: Date
}

export abstract class DomainEvent<T> {
    static EVENT_NAME: string

    readonly aggregateId: string
    readonly eventId: string
    readonly occurredOn: Date
    readonly eventName: string
    readonly payload: T

    protected constructor(params: DomainEventParams<T> & { eventName: string }) {
        const { eventName, aggregateId, payload, eventId, occurredOn } = params
        this.aggregateId = aggregateId
        this.eventId = eventId || crypto.randomUUID()
        this.payload = payload
        this.occurredOn = occurredOn || new Date()
        this.eventName = eventName
    }

    toPrimitives(): { uid: string; payload: T } {
        return {
            uid: this.aggregateId,
            payload: this.payload,
        }
    }
}

export type DomainEventClass = {
    EVENT_NAME: string
    fromPrimitives(params: {
        aggregateId: string
        eventId: string
        occurredOn: Date
        attributes: undefined
    }): DomainEvent<undefined>
}
