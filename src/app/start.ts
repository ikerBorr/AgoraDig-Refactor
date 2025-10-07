import 'dotenv/config'
import { Router } from 'express'
import { ExpressApp } from '@/app/express.app'
// @ts-ignore auto-generated
import { router as routers } from '@/app/routes/auto-router'

function generateRoutes() {
    const router = Router()
    if (!router) {
        throw new Error('Router must be set')
    }

    router.use('/api', routers)

    return router
}

function main() {
    const routes: Router = generateRoutes()

    const app = new ExpressApp({
        port: Number(process.env.PORT) || 3000,
        environment: process.env.NODE_ENV as 'development' | 'production' | 'test',
        mongoUri: process.env.MONGO_URI,
        sessionSecret: process.env.SESSION_SECRET,
        corsOrigins: process.env.CORS_ORIGINS
            ? process.env.CORS_ORIGINS.split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
            : [],
        rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS),
        rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX),
    })

    app.enableHealthCheck('/health').useRouter(routes).setupGracefulShutdown()

    app.start().catch((err) => {
        console.error('Failed to start server:', err)
        process.exit(1)
    })
}

main()
