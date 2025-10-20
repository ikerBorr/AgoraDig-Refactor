import type { MemberRepository } from '@/contexts/forum/member/domain/ports/member.repository'
import { Member } from '@/contexts/forum/member/domain/entities/member'
import { Uuid } from '@/contexts/shared-kernel/domain/value-objects/uuid'
import type { Nullable } from '@/contexts/shared-kernel/application/types/nullable'

export class InMemoryMemberRepository implements MemberRepository {
    private readonly members: Member[] = [
        Member.fromPrimitives({
            uid: Uuid.random().value,
            accountUid: Uuid.random().value,
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: new Date('1990-05-14').getTime(),
            description: 'A passionate forum contributor.',
            acceptsPublicity: true,
        }),
        Member.fromPrimitives({
            uid: Uuid.random().value,
            accountUid: Uuid.random().value,
            firstName: 'Jane',
            lastName: 'Smith',
            dateOfBirth: new Date('1988-11-02').getTime(),
            description: 'Active in tech discussions.',
            acceptsPublicity: false,
        }),
    ]

    async save(member: Member): Promise<void> {
        const index = this.members.findIndex((m) => m.uid.value === member.uid.value)

        if (index >= 0) {
            this.members[index] = member
        } else {
            this.members.push(member)
        }
    }

    async searchByUuid(uid: Uuid): Promise<Nullable<Member>> {
        return this.members.find((m) => m.uid.value === uid.value) ?? null
    }
}
