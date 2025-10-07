import type express from 'express'

export function GET(req: express.Request, res: express.Response) {
    console.log(req.method, req.originalUrl)
    try {
        const user = 'hola'
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: (error as Error).message })
    }
}
