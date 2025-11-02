import {createClient, type RedisClientType} from "redis";

export class RedisClient {
    private static redisUrl = process.env.REDIS_URL!;
    private static instance: RedisClientType | null = null;

    private constructor() {}

    public static async getInstance(redisUrl?: string): Promise<RedisClientType> {
        if (!this.instance) {
            this.instance = createClient({ url: redisUrl || this.redisUrl});

            this.instance.on("error", (err) => {
                console.error("[Redis] Connection Error:", err);
            });

            await this.instance.connect();
        }
        return this.instance;
    }

    public static async disconnect(): Promise<void> {
        if (this.instance) {
            await this.instance.quit();
            this.instance = null;
        }
    }
}