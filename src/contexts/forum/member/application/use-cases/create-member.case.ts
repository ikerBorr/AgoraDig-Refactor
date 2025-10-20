import type { CreateMemberCommand } from '@/contexts/forum/member/application/commands/create-memeber.command'
import { Member } from '@/contexts/forum/member/domain/entities/member'
import type { MemberRepository } from '@/contexts/forum/member/domain/ports/member.repository'
import { AccountAlreadyAssociatedWithActiveMemberError } from '@/contexts/forum/member/application/exceptions/create-member.expection'
import { inject } from 'inversify'
import { MEMBER_CONTAINER } from '@/contexts/forum/member/infrastructure/di/symbols'

export class CreateMember {
    constructor(
        @inject(MEMBER_CONTAINER.MemberRepository)
        private readonly memberRepository: MemberRepository,
    ) {}

    async execute(command: CreateMemberCommand) {
        const member = Member.create(command)

        if (await this.memberRepository.searchByUuid(member.uid)) {
            throw new AccountAlreadyAssociatedWithActiveMemberError()
        }

        await this.memberRepository.save(member)

        return member.toPrimitives()
    }
}
