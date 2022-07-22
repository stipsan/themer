import JSON5 from 'json5'
import { snippet } from 'utils/snippets'

const esmUrl = JSON5.stringify('http://localhost/api/hues')
const esmOrigin = JSON5.stringify('http://localhost/')
const staticImport = `import { theme } from 'http://localhost/api/hues'`

test('import-dynamic-js', () => {
  expect(snippet('import-dynamic-js')(esmUrl)).toMatchInlineSnapshot(
    `"const {theme} = await import('http://localhost/api/hues')"`
  )
})
test('import-dynamic-ts', () => {
  expect(snippet('import-dynamic-ts')(esmUrl)).toMatchInlineSnapshot(`
    "const {theme} = (await import(
      // @ts-expect-error -- TODO setup themer.d.ts to get correct typings
      'http://localhost/api/hues'
    )) as {theme: import('sanity').StudioTheme}"
  `)
})
test('import-static', () => {
  expect(snippet('import-static')(esmUrl)).toMatchInlineSnapshot(
    `"import {theme} from 'http://localhost/api/hues'"`
  )
})
test('studio-config', () => {
  expect(snippet('studio-config')(staticImport)).toMatchInlineSnapshot(`
    "// Add two lines of code to your workspace
    import {createConfig} from 'sanity'
    import {deskTool} from 'sanity/desk'

    import {schemaTypes} from './schemas'

    // 1. Add the import
    import { theme } from 'http://localhost/api/hues'

    export default createConfig({
      theme, // <-- 2. add the theme here

      name: 'default',
      title: 'My Sanity Project',
      projectId: 'b5vzhxkv',
      dataset: 'production',
      plugins: [deskTool()],
      schema: {types: schemaTypes}
    })"
  `)
})
test('studio-config-static-import', () => {
  expect(snippet('studio-config-static-import')(staticImport))
    .toMatchInlineSnapshot(`
    "// Add two lines of code to your workspace
    import {createConfig} from 'sanity'
    import {deskTool} from 'sanity/desk'
    // 1. Add the import
    import { theme } from 'http://localhost/api/hues'

    import {schemaTypes} from './schemas'

    export default createConfig({
      theme, // <-- 2. add the theme here

      name: 'default',
      title: 'My Sanity Project',
      projectId: 'b5vzhxkv',
      dataset: 'production',
      plugins: [deskTool()],
      schema: {types: schemaTypes}
    })"
  `)
})
test('sanity.cli.ts', () => {
  expect(snippet('sanity.cli.ts')()).toMatchInlineSnapshot(`
    "// Change target to allow top-level await in sanity.config.ts
    import {createCliConfig} from 'sanity/cli'
    import type {UserConfig} from 'vite'

    export default createCliConfig({
      api: {projectId: 'b5vzhxkv', dataset: 'production'},
      vite: (config: UserConfig): UserConfig => ({
        ...config,
        build: {...config.build, target: 'esnext'}
      })
    })"
  `)
})
test('sanity.cli.js', () => {
  expect(snippet('sanity.cli.js')()).toMatchInlineSnapshot(`
    "// Change target to allow top-level await in sanity.config.js
    import {createCliConfig} from 'sanity/cli'

    export default createCliConfig({
      api: {projectId: 'b5vzhxkv', dataset: 'production'},
      vite: config => ({...config, build: {...config.build, target: 'esnext'}})
    })"
  `)
})
test('studio-config-create-theme', () => {
  expect(snippet('studio-config-create-theme')(staticImport))
    .toMatchInlineSnapshot(`
    "// Import createTheme and hues to quickly modify your theme without changing the import URL
    import {createConfig} from 'sanity'
    import {deskTool} from 'sanity/desk'

    import {schemaTypes} from './schemas'

    import { theme } from 'http://localhost/api/hues'

    export default createConfig({
      theme: createTheme({...hues, primary: {...hues.primary, mid: '#22fca8'}}),

      name: 'default',
      title: 'My Sanity Project',
      projectId: 'b5vzhxkv',
      dataset: 'production',
      plugins: [deskTool()],
      schema: {types: schemaTypes}
    })"
  `)
})
test('import-create-theme-static', () => {
  expect(snippet('import-create-theme-static')(esmUrl)).toMatchInlineSnapshot(
    `"import {createTheme, hues} from 'http://localhost/api/hues'"`
  )
})
test('import-create-theme-dynamic', () => {
  expect(snippet('import-create-theme-dynamic')(esmUrl)).toMatchInlineSnapshot(`
    "const {createTheme, hues} = await import(
      'http://localhost/api/hues'
    )"
  `)
})
test('themer.d.ts', () => {
  expect(snippet('themer.d.ts')(esmUrl)).toMatchInlineSnapshot(`
    "module 'http://localhost/api/hues' {
      interface Hue
        extends Omit<import('@sanity/color').ColorHueConfig, 'title' | 'midPoint'> {
        midPoint: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
      }
      interface Hues {
        default: Hue
        transparent: Hue
        primary: Hue
        positive: Hue
        caution: Hue
        critical: Hue
      }
      const hues: Hues
      type Theme = import('sanity').StudioTheme
      const createTheme = (hues: Hues): Theme => theme
      const theme: Theme

      export {hues, createTheme, theme}
    }"
  `)
})
test('tsconfig', () => {
  expect(snippet('tsconfig')()).toMatchInlineSnapshot(`
    "{
      \\"compilerOptions\\": {
        // target needs to be es2017 or newer to allow top-level await
        \\"target\\": \\"es2017\\",

        \\"lib\\": [\\"dom\\", \\"dom.iterable\\", \\"esnext\\"],
        \\"allowJs\\": true,
        \\"skipLibCheck\\": true,
        \\"strict\\": true,
        \\"forceConsistentCasingInFileNames\\": true,
        \\"noEmit\\": true,
        \\"esModuleInterop\\": true,
        \\"module\\": \\"esnext\\",
        \\"moduleResolution\\": \\"node\\",
        \\"resolveJsonModule\\": true,
        \\"isolatedModules\\": true,
        \\"jsx\\": \\"preserve\\",
        \\"incremental\\": true
      },
      \\"include\\": [\\"**/*.ts\\", \\"**/*.tsx\\"],
      \\"exclude\\": [\\"node_modules\\"]
    }"
  `)
})
test('_document.tsx', () => {
  expect(snippet('_document.tsx')(esmUrl)).toMatchInlineSnapshot(`
    "// This is to generate a <link rel=\\"modulepreload\\" href=\\"'http://localhost/api/hues'\\"> to the <head>
    // As Studio v3 is in developer preview there's not yet a simple way to just add a <link> tag to the <head>
    // Thus we have to re-implement DefaultDocument to make it happen.
    // Expect this to get much easier before v3 hits stable

    import React from 'react'
    import {type DefaultDocumentProps} from 'sanity'
    import {GlobalErrorHandler} from 'sanity/_unstable'

    const globalStyles = \`
      html {
        background-color: #f1f3f6;
      }
      html,
      body,
      #sanity {
        height: 100%;
      }
      body {
        margin: 0;
        -webkit-font-smoothing: antialiased;
      }
    \`

    interface FaviconProps {
      basePath: string
    }

    function Favicons({basePath}: FaviconProps) {
      const base = \`\${basePath.replace(/\\\\/+$/, '')}/static\`
      return (
        <>
          <link rel=\\"icon\\" href={\`\${base}/favicon.ico\`} sizes=\\"any\\" />
          <link rel=\\"icon\\" href={\`\${base}/favicon.svg\`} type=\\"image/svg+xml\\" />
          <link rel=\\"apple-touch-icon\\" href={\`\${base}/apple-touch-icon.png\`} />
          <link rel=\\"manifest\\" href={\`\${base}/manifest.webmanifest\`} />
        </>
      )
    }

    const EMPTY_ARRAY: never[] = []
    export default function DefaultDocument(
      props: DefaultDocumentProps
    ): React.ReactElement {
      const {entryPath, css = EMPTY_ARRAY, basePath = '/'} = props
      return (
        <html lang=\\"en\\">
          <head>
            <meta charSet=\\"utf-8\\" />
            <meta
              name=\\"viewport\\"
              content=\\"width=device-width, initial-scale=1, viewport-fit=cover\\"
            />
            <meta name=\\"robots\\" content=\\"noindex\\" />
            <meta name=\\"referrer\\" content=\\"same-origin\\" />
            {/* This is the only line of code we're adding that is different from the default implementation of DefaultDocument */}
            <link
              rel=\\"modulepreload\\"
              href={'http://localhost/api/hues'}
            />

            <Favicons basePath={basePath} />

            <title>Sanity Studio</title>

            <GlobalErrorHandler />

            {css.map(href => (
              <link key={href} rel=\\"stylesheet\\" href={href} />
            ))}
            <style>{globalStyles}</style>
          </head>
          <body>
            <div id=\\"sanity\\" />
            <script type=\\"module\\" src={entryPath} />
          </body>
        </html>
      )
    }"
  `)
})

test('_document.js', () => {
  expect(snippet('_document.js')(esmUrl)).toMatchInlineSnapshot(`
    "// This is to generate a <link rel=\\"modulepreload\\" href=\\"'http://localhost/api/hues'\\"> to the <head>
    // As Studio v3 is in developer preview there's not yet a simple way to just add a <link> tag to the <head>
    // Thus we have to re-implement DefaultDocument to make it happen.
    // Expect this to get much easier before v3 hits stable

    import React from 'react'
    import {GlobalErrorHandler} from 'sanity/_unstable'

    const globalStyles = \`
      html {
        background-color: #f1f3f6;
      }
      html,
      body,
      #sanity {
        height: 100%;
      }
      body {
        margin: 0;
        -webkit-font-smoothing: antialiased;
      }
    \`

    function Favicons({basePath}) {
      const base = \`\${basePath.replace(/\\\\/+$/, '')}/static\`
      return (
        <>
          <link rel=\\"icon\\" href={\`\${base}/favicon.ico\`} sizes=\\"any\\" />
          <link rel=\\"icon\\" href={\`\${base}/favicon.svg\`} type=\\"image/svg+xml\\" />
          <link rel=\\"apple-touch-icon\\" href={\`\${base}/apple-touch-icon.png\`} />
          <link rel=\\"manifest\\" href={\`\${base}/manifest.webmanifest\`} />
        </>
      )
    }

    const EMPTY_ARRAY = []
    export default function DefaultDocument(props) {
      const {entryPath, css = EMPTY_ARRAY, basePath = '/'} = props
      return (
        <html lang=\\"en\\">
          <head>
            <meta charSet=\\"utf-8\\" />
            <meta
              name=\\"viewport\\"
              content=\\"width=device-width, initial-scale=1, viewport-fit=cover\\"
            />
            <meta name=\\"robots\\" content=\\"noindex\\" />
            <meta name=\\"referrer\\" content=\\"same-origin\\" />
            {/* This is the only line of code we're adding that is different from the default implementation of DefaultDocument */}
            <link
              rel=\\"modulepreload\\"
              href={'http://localhost/api/hues'}
            />

            <Favicons basePath={basePath} />

            <title>Sanity Studio</title>

            <GlobalErrorHandler />

            {css.map(href => (
              <link key={href} rel=\\"stylesheet\\" href={href} />
            ))}
            <style>{globalStyles}</style>
          </head>
          <body>
            <div id=\\"sanity\\" />
            <script type=\\"module\\" src={entryPath} />
          </body>
        </html>
      )
    }"
  `)
})

test('next-config-build-time-js', () => {
  expect(snippet('next-config-build-time-js')(esmOrigin))
    .toMatchInlineSnapshot(`
    "module.exports = {
      experimental: {urlImports: ['http://localhost/']}
    }"
  `)
})

test('next-config-build-time-tsconfig', () => {
  expect(snippet('next-config-build-time-ts')(esmOrigin))
    .toMatchInlineSnapshot(`
    "// @ts-check

    /**
     * @type {import('next').NextConfig}
     **/
    const nextConfig = {
      experimental: {urlImports: ['http://localhost/']}
    }

    module.exports = nextConfig"
  `)
})

test('pages/_document.tsx', () => {
  expect(snippet('pages/_document.tsx')()).toMatchInlineSnapshot(`
    "// This is necessary for SSR to work correctly and prevents broken CSS

    import Document, {type DocumentContext} from 'next/document'
    import {ServerStyleSheet} from 'styled-components'

    export default class CustomDocument extends Document {
      static async getInitialProps(ctx: DocumentContext) {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
          ctx.renderPage = () =>
            originalRenderPage({
              enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
            })

          const initialProps = await Document.getInitialProps(ctx)
          return {
            ...initialProps,
            styles: [initialProps.styles, sheet.getStyleElement()]
          }
        } finally {
          sheet.seal()
        }
      }
    }"
  `)
})

test('pages/_document.js', () => {
  expect(snippet('pages/_document.js')()).toMatchInlineSnapshot(`
    "// This is necessary for SSR to work correctly and prevents broken CSS

    import Document from 'next/document'
    import {ServerStyleSheet} from 'styled-components'

    export default class CustomDocument extends Document {
      static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
          ctx.renderPage = () =>
            originalRenderPage({
              enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
            })

          const initialProps = await Document.getInitialProps(ctx)
          return {
            ...initialProps,
            styles: [initialProps.styles, sheet.getStyleElement()]
          }
        } finally {
          sheet.seal()
        }
      }
    }"
  `)
})

test('studio-config-create-theme-static-import', () => {
  expect(snippet('studio-config-create-theme-static-import')(staticImport))
    .toMatchInlineSnapshot(`
    "// Import createTheme and hues to quickly modify your theme without changing the import URL
    import {createConfig} from 'sanity'
    import {deskTool} from 'sanity/desk'

    import { theme } from 'http://localhost/api/hues'

    import {schemaTypes} from './schemas'

    export default createConfig({
      theme: createTheme({...hues, primary: {...hues.primary, mid: '#22fca8'}}),

      name: 'default',
      title: 'My Sanity Project',
      projectId: 'b5vzhxkv',
      dataset: 'production',
      plugins: [deskTool()],
      schema: {types: schemaTypes}
    })"
  `)
})
