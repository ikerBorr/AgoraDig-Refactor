import { Container } from 'inversify'
import { AuthModule } from '@/contexts/auth/infrastructure/di/inversify.module'
import { MemberModule } from '@/contexts/forum/member/infrastructure/di/inversify.module'

export class ApiContainer {
    private static instance: Container | null = null

    private static async create() {
        const container = new Container({ defaultScope: 'Transient' })

        await container.load(AuthModule)
        await container.load(MemberModule)

        ApiContainer.instance = container
    }

    static async container(): Promise<Container> {
        if (!this.instance) {
            await ApiContainer.create()
        }
        return ApiContainer.instance!
    }
}
