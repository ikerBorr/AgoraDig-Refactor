import type express from 'express'
import YAML from 'yamljs'
import path from 'path'

export async function GET(_req: express.Request, res: express.Response) {
    const specPath = path.resolve(process.cwd(), './docs/api/openapi.yaml')
    const spec = YAML.load(specPath)
    const specJson = JSON.stringify(spec)

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>API Docs</title>
          <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>body { margin: 0; background: #fafafa; }</style>
        </head>
        <body>
          <div id="swagger-ui"></div>
        
          <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
          <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function () {
              SwaggerUIBundle({
                spec: ${specJson},
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
                layout: "StandaloneLayout"
              });
            };
          </script>
        </body>
        </html>`.trim()

    res.status(200).type('html').send(html)
}
