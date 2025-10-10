import express from 'express'
import type { Express, Router, RequestHandler, ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { config } from 'dotenv'
import morgan from 'morgan'
import type http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'

config()

export interface ExpressAppConfig {
    port?: number
    mongoUri?: string
    sessionSecret?: string
    corsOrigins?: string[]
    corsOriginRegex?: string
    corsCredentials?: boolean
    environment?: 'development' | 'production' | 'test'
    rateLimitWindowMs?: number
    rateLimitMaxRequests?: number
}

export interface CustomMiddleware {
    path?: string
    handler: RequestHandler | ErrorRequestHandler
}

interface ErrorResponse {
    statusCode: number
    error: string
    message: string
    timestamp?: string
    path?: string
    [key: string]: unknown
}

export class ExpressServer {
    private readonly app: Express
    private readonly config: Required<ExpressAppConfig>
    private server: http.Server | undefined
    private routers: Router | undefined
    private customMiddlewares: CustomMiddleware[]
    private errorHandler: ErrorRequestHandler | undefined
    private isStarted: boolean = false

    constructor(config: ExpressAppConfig = {}) {
        this.app = express()
        this.config = this.mergeConfig(config)
        this.routers = undefined
        this.customMiddlewares = []
        this.initializeMiddlewares()
    }

    private mergeConfig(config: ExpressAppConfig): Required<ExpressAppConfig> {
        return {
            port: config.port || parseInt(process.env.PORT!),
            mongoUri: config.mongoUri || process.env.MONGO_URI || '',
            sessionSecret: config.sessionSecret || process.env.SESSION_SECRET || '',
            corsOrigins:
                config.corsOrigins ||
                (process.env.CORS_ORIGINS
                    ? process.env.CORS_ORIGINS.split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                    : []),
            corsOriginRegex: config.corsOriginRegex || process.env.CORS_ORIGIN_REGEX || '',
            corsCredentials:
                typeof config.corsCredentials === 'boolean'
                    ? config.corsCredentials
                    : process.env.CORS_CREDENTIALS === 'true',
            environment:
                config.environment ||
                (process.env.NODE_ENV as 'development' | 'production' | 'test') ||
                'development',
            rateLimitWindowMs: config.rateLimitWindowMs || 15 * 60 * 1000,
            rateLimitMaxRequests: config.rateLimitMaxRequests || 100,
        }
    }

    private initializeMiddlewares(): void {
        this.app.use(cookieParser(process.env.COOKIE_SECRET))
        this.app.set('trust proxy', 1)

        this.app.use(
            helmet({
                contentSecurityPolicy: this.config.environment === 'production',
                crossOriginEmbedderPolicy: this.config.environment === 'production',
            }),
        )

        const { corsOrigins, corsOriginRegex, corsCredentials } = this.config
        const regex = corsOriginRegex ? new RegExp(corsOriginRegex) : null

        const isAllowed = (origin?: string | null) => {
            if (!origin) return false
            if (corsOrigins.includes(origin)) return true
            return regex?.test(origin) || false
        }

        this.app.use(
            cors({
                origin(origin, cb) {
                    if (!origin) return cb(null, false)
                    if (isAllowed(origin)) return cb(null, true)
                    return cb(new Error('Not allowed by CORS'))
                },
                credentials: corsCredentials || false,
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
                allowedHeaders: [
                    'Content-Type',
                    'Authorization',
                    'X-Requested-With',
                    'X-Request-ID',
                ],
                exposedHeaders: ['X-Request-ID'],
                maxAge: 600,
            }),
        )

        const limiter = rateLimit({
            windowMs: this.config.rateLimitWindowMs,
            limit: this.config.rateLimitMaxRequests,
            standardHeaders: true,
            legacyHeaders: false,
            message: 'Too many requests from this IP, please try again later.',
        })
        this.app.use(limiter)

        const morganFormat = this.config.environment === 'production' ? 'combined' : 'dev'
        this.app.use(morgan(morganFormat))

        this.app.use(compression())

        this.app.use(express.json({ limit: '10mb' }))
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))
    }

    private applyCustomConfiguration(): void {
        this.customMiddlewares.forEach((middleware) => {
            if (middleware.path) {
                this.app.use(middleware.path, middleware.handler)
            } else {
                this.app.use(middleware.handler)
            }
        })

        if (this.routers) {
            this.app.use(this.routers)
        }

        this.applyErrorHandlers()
    }

    private applyErrorHandlers(): void {
        this.app.use((req, res, _next) => {
            return res.status(404).json({
                statusCode: 404,
                error: 'Not Found',
                message: `Route ${req.method} ${req.path} not found`,
                timestamp: new Date().toISOString(),
                path: req.path,
            })
        })

        if (this.errorHandler != null) {
            this.app.use(this.errorHandler)
        } else {
            this.app.use(
                (
                    err: Error,
                    _req: express.Request,
                    res: express.Response,
                    _next: express.NextFunction,
                ) => {
                    console.error('Error:', err)

                    const message =
                        this.config.environment === 'production'
                            ? 'Internal Server Error'
                            : err.message || 'Something went wrong'

                    res.status(500).json({ error: err.name || 'Error', message })
                },
            )
        }
    }

    public useRouter(router: Router): this {
        if (this.isStarted) {
            throw new Error('Cannot add routers after server has started')
        }
        this.routers = router
        return this
    }

    public useMiddleware(middleware: CustomMiddleware): this {
        if (this.isStarted) {
            throw new Error('Cannot add middlewares after server has started')
        }

        this.customMiddlewares.push(middleware)
        return this
    }

    public useErrorHandler(errorHandler: ErrorRequestHandler): this {
        if (this.isStarted) {
            throw new Error('Cannot add error handler after server has started')
        }

        this.errorHandler = errorHandler
        return this
    }

    public enableHealthCheck(path: string = '/health'): this {
        if (this.isStarted) {
            throw new Error('Cannot enable health check after server has started')
        }

        this.customMiddlewares.push({
            handler: (req: express.Request, res: express.Response, next: express.NextFunction) => {
                if (req.path === path && req.method === 'GET') {
                    return res.status(200).json({
                        status: 'ok',
                        timestamp: new Date().toISOString(),
                        uptime: process.uptime(),
                        environment: this.config.environment,
                    })
                }
                next()
            },
        })
        return this
    }

    public async start(): Promise<void> {
        if (this.isStarted) {
            throw new Error('Server is already running')
        }

        this.applyCustomConfiguration()

        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(this.config.port, () => {
                    this.isStarted = true
                    console.clear()
                    console.log(`
╔════════════════════════════════════════════╗
║  🚀 Server started successfully            ║
║  📍 URL: ${'http://localhost:'.concat(this.config.port.toString().padEnd(16))} ║
║  ⏰  Started at: ${new Date().toLocaleString().padEnd(26)} ║
╚════════════════════════════════════════════╝
          `)
                    resolve()
                })

                this.server.on('error', (error: ErrorResponse) => {
                    if (error.code === 'EADDRINUSE') {
                        console.error(`Port ${this.config.port} is already in use`)
                    } else {
                        console.error('Server error:', error)
                    }
                    reject(error)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    public async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.server) {
                resolve()
                return
            }

            this.server.close((err: Error | undefined) => {
                if (err) {
                    console.error('Error closing server:', err)
                    reject(err)
                } else {
                    this.isStarted = false
                    console.log('Server closed successfully')
                    resolve()
                }
            })
        })
    }

    public setupGracefulShutdown(): this {
        const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT']

        signals.forEach((signal) => {
            process.on(signal, async () => {
                console.log(`\n${signal} received, shutting down gracefully...`)
                try {
                    await this.stop()
                    process.exit(0)
                } catch (error) {
                    console.error('Error during shutdown:', error)
                    process.exit(1)
                }
            })
        })

        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason)
        })

        process.on('uncaughtException', (error) => {
            console.error('Uncaught Exception:', error)
            process.exit(1)
        })

        return this
    }
}
