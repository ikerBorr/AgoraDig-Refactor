import {DomainEvent} from "@/contexts/shared/domain/entities/domain-event";

export abstract class AggregateRoot {
    private domainEvents: Array<DomainEvent<unknown>>

    constructor() {
        this.domainEvents = []
    }

    pullDomainEvents(): Array<DomainEvent<unknown>> {
        const domainEvents = this.domainEvents.slice()
        this.domainEvents = []

        return domainEvents
    }

    record<T>(event: DomainEvent<T>): void {
        this.domainEvents.push(event)
    }
}
