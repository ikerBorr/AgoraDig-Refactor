import { ContainerModule, type ContainerModuleLoadOptions } from 'inversify'
import type { MemberRepository } from '@/contexts/forum/member/domain/ports/member.repository'
import { MEMBER_CONTAINER } from '@/contexts/forum/member/infrastructure/di/symbols'
import { InMemoryMemberRepository } from '@/contexts/forum/member/infrastructure/repositories/in-memory-member'
import { CreateMember } from '@/contexts/forum/member/application/use-cases/create-member.case'

export const MemberModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
    options.bind<MemberRepository>(MEMBER_CONTAINER.MemberRepository).to(InMemoryMemberRepository)

    options.bind<CreateMember>(MEMBER_CONTAINER.CreateMember).to(CreateMember)
})
