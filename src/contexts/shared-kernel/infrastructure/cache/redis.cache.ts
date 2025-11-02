import type { Cache } from '@/contexts/shared-kernel/domain/ports/cache'
import { RedisClient } from '@/contexts/shared-kernel/infrastructure/cache/redis-client'

export abstract class RedisCache implements Cache {
    async get<T>(key: string): Promise<T | null> {
        const data = await (await RedisClient.getInstance()).get(key)
        return data ? (JSON.parse(data) as T) : null
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        const serialized = JSON.stringify(value)

        if (ttlSeconds && ttlSeconds > 0) {
            await (await RedisClient.getInstance()).setEx(key, ttlSeconds, serialized)
        } else {
            await (await RedisClient.getInstance()).set(key, serialized)
        }
    }

    async del(key: string): Promise<void> {
        await (await RedisClient.getInstance()).del(key)
    }
}
