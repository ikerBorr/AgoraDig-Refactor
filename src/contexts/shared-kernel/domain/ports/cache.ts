import type { Nullable } from '@/contexts/shared-kernel/application/types/nullable'

export interface Cache {
    get<T>(key: string): Promise<Nullable<T>>
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>
    del(key: string): Promise<void>
}
