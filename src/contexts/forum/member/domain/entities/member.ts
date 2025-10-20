import { FirstName } from '@/contexts/shared-kernel/domain/value-objects/first-name'
import { LastName } from '@/contexts/shared-kernel/domain/value-objects/last-name'
import { BirthDate } from '@/contexts/forum/member/domain/value-objects/birth-date'
import { Description } from '@/contexts/shared-kernel/domain/value-objects/description'
import { Uuid } from '@/contexts/shared-kernel/domain/value-objects/uuid'

export interface MemberPrimitives {
    uid: string
    accountUid: string
    firstName: string
    lastName: string
    dateOfBirth: number
    description: string
    acceptsPublicity: boolean
}

export class Member {
    private constructor(
        readonly uid: Uuid,
        readonly accountUid: Uuid,
        readonly firstName: FirstName,
        readonly lastName: LastName,
        readonly dateOfBirth: BirthDate,
        readonly description: Description,
        readonly acceptsPublicity: boolean,
    ) {}

    static create(primitives: Omit<MemberPrimitives, 'uid'>) {
        return new Member(
            Uuid.random(),
            new Uuid(primitives.accountUid),
            new FirstName(primitives.firstName),
            new LastName(primitives.lastName),
            new BirthDate(primitives.dateOfBirth),
            new Description(primitives.description),
            primitives.acceptsPublicity,
        )
    }

    static fromPrimitives(primitives: MemberPrimitives) {
        return new Member(
            new Uuid(primitives.uid),
            new Uuid(primitives.accountUid),
            new FirstName(primitives.firstName),
            new LastName(primitives.lastName),
            new BirthDate(primitives.dateOfBirth),
            new Description(primitives.description),
            primitives.acceptsPublicity,
        )
    }

    toPrimitives(): MemberPrimitives {
        return {
            uid: this.uid.value,
            accountUid: this.accountUid.value,
            firstName: this.firstName.value,
            lastName: this.lastName.value,
            dateOfBirth: this.dateOfBirth.value,
            description: this.description.value,
            acceptsPublicity: this.acceptsPublicity,
        }
    }
}
