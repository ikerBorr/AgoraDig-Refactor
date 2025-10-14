import type express from 'express'
import YAML from 'yamljs'
import path from 'node:path'

export async function GET(_req: express.Request, res: express.Response) {
    const specPath = path.resolve(process.cwd(), './docs/api/openapi.yaml')
    const spec = YAML.load(specPath)
    const specJson = JSON.stringify(spec)

    const html = `
        <!doctype html>
        <html lang="en" data-theme="dark">
        <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
              <title>API Documentation</title>
            
              <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
              <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
              <style>
                    html, body, elements-api { height: 100%; margin: 0; }
                    elements-api > div { width: 100%; }
              </style>
            </head>
        <body>
              <elements-api id="docs" router="hash" style="display:flex; height:100vh; width:100vw"/>
            
              <script type="application/json" id="openapi-spec">${specJson}</script>
              <script>
                    const spec = JSON.parse(document.getElementById('openapi-spec').textContent);
                    document.getElementById('docs').apiDescriptionDocument = spec;
              </script>
        </body>
        </html>
    `

    res.status(200).type('html').send(html)
}
