import {
    DomainEvent,
    type DomainEventParams,
} from '@/contexts/shared-kernel/domain/entities/domain-event'

export interface UserAuthCreatedPrimitives {
    firstName: string
    lastName: string
    dateOfBirth: string
    username: string
    email: string
    password: string
    description: string
    acceptsPublicity: string
}

export class UserAuthCreatedEvent extends DomainEvent<UserAuthCreatedPrimitives> {
    constructor(params: DomainEventParams<UserAuthCreatedPrimitives>) {
        super({
            eventName: 'user.auth.created',
            ...params,
        })
    }
}
