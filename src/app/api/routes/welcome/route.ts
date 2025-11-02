import type express from 'express'
import path from 'node:path'

export async function GET(_req: express.Request, res: express.Response) {
    res.sendFile(path.join(__dirname, '/../../../../../public', 'index.html'));
}
