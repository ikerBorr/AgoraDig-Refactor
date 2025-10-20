import type { Nullable } from '@/contexts/shared-kernel/application/types/nullable'
import type { Member } from '@/contexts/forum/member/domain/entities/member'
import type { Uuid } from '@/contexts/shared-kernel/domain/value-objects/uuid'

export interface MemberRepository {
    save(member: Member): Promise<void>
    searchByUuid(uid: Uuid): Promise<Nullable<Member>>
}
