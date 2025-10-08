import fg from 'fast-glob'
import { promises as fs } from 'fs'
import path from 'path'

class RouteGenerator {
    HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

    _baseDir = ''
    _endFileDir = ''
    _routerFileName = ''

    constructor(baseDir, endFileDir, routerFileName = 'route.ts') {
        this._baseDir = path.resolve(baseDir)
        this._endFileDir = path.resolve(endFileDir)
        this._routerFileName = routerFileName
    }

    async _findRouters() {
        const pattern = `**/${this._routerFileName}`
        const files = await fg(pattern, { cwd: this._baseDir, absolute: true })
        files.sort()
        return files
    }

    _endpointFromPath(filePath) {
        let rel = path.relative(this._baseDir, filePath).replace(/\\/g, '/')

        const escaped = this._escapeRegExp(this._routerFileName.replace(/\.(ts|js)$/, ''))
        rel = rel.replace(new RegExp(`/${escaped}\\.(ts|js)$`), '')

        if (rel === '' || rel === this._routerFileName.replace(/\.(ts|js)$/, '')) rel = '/'
        else rel = '/' + rel

        rel = rel.replace(/\[(.+?)\]/g, ':$1')

        return rel
    }

    _makeImportPath(targetAbs) {
        let rel = path.relative(path.dirname(this._endFileDir), targetAbs).replace(/\\/g, '/')
        rel = rel.replace(/\.(ts|js)$/, '')
        if (!rel.startsWith('.')) rel = './' + rel
        return rel
    }

    _escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    async _introspectHandlers(absFile) {
        const src = await fs.readFile(absFile, 'utf8')
        const present = []
        for (const M of this.HTTP_METHODS) {
            const reVar = new RegExp(`export\\s+(?:const|let|var)\\s+${M}\\b`)
            const reFn = new RegExp(`export\\s+(?:async\\s+)?function\\s+${M}\\b`)
            const reNamed = new RegExp(`export\\s*\\{[^}]*\\b${M}\\b[^}]*\\}`)
            if (reVar.test(src) || reFn.test(src) || reNamed.test(src)) {
                present.push(M)
            }
        }
        return present
    }

    _generateCode(filesWithMethods) {
        const importLines = [`import { Router } from "express";`]
        const registrations = [`const router = Router();`]

        filesWithMethods.forEach(({ file, methods }, idx) => {
            const endpoint = this._endpointFromPath(file)
            const importPath = this._makeImportPath(file)
            const modVar = `R${idx}`

            importLines.push(`import * as ${modVar} from "${importPath}";`)
            registrations.push(`{`)
            registrations.push(`  const ep = ${JSON.stringify(endpoint)};`)
            for (const METHOD of methods) {
                const lower = METHOD.toLowerCase()
                registrations.push(`  router.${lower}(ep, ${modVar}.${METHOD});`)
                console.log(`✔ ${METHOD} ${endpoint}`)
            }
            registrations.push(`}`)
        })

        registrations.push(`export {router};`)

        return { importLines, registrations }
    }

    async _createFiles(importLines, registrations) {
        await fs.mkdir(path.dirname(this._endFileDir), { recursive: true })
        const content =
            `// AUTO-GENERATED - DO NOT EDIT\n` +
            importLines.join('\n') +
            `\n\n` +
            registrations.join('\n') +
            `\n`

        await fs.writeFile(this._endFileDir, content, 'utf8')
    }

    async generate() {
        const files = await this._findRouters()

        const filesWithMethods = await Promise.all(
            files.map(async (file) => ({
                file,
                methods: await this._introspectHandlers(file),
            })),
        )

        const { importLines, registrations } = this._generateCode(filesWithMethods)
        await this._createFiles(importLines, registrations)
    }
}

async function main() {
    const generator = new RouteGenerator('./src/app/http/routes', './src/app/http/routes/auto-router.ts')

    try {
        console.log('\n=== 🛠  Generating routes... ===\n')
        await generator.generate()
        console.log('')
    } catch (err) {
        console.error(err)
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
