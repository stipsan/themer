// Automatically generated by running `npm run build:snippets`

export function snippet(id: 'import-dynamic-js'): (first: string) => string
export function snippet(id: 'import-dynamic-ts'): (first: string) => string
export function snippet(id: 'import-static'): (first: string) => string
export function snippet(id: 'studio-config'): (first: string) => string
export function snippet(id: 'sanity.cli.ts'): () => string
export function snippet(id: 'sanity.cli.js'): () => string
export function snippet(
  id: 'studio-config-create-theme'
): (first: string) => string
export function snippet(
  id: 'import-create-theme-static'
): (first: string) => string
export function snippet(
  id: 'import-create-theme-dynamic'
): (first: string) => string
export function snippet(id: 'themer.d.ts'): (first: string) => string
export function snippet(id: 'tsconfig'): () => string
export function snippet(id: '_document.tsx'): (first: string) => string
export function snippet(id) {
  switch (id) {
    case 'import-dynamic-js':
      return (first: string) => `const {theme} = await import(${first})`

    case 'import-dynamic-ts':
      return (first: string) => `const {theme} = (await import(
  // @ts-expect-error -- TODO setup themer.d.ts to get correct typings
  ${first}
)) as {theme: import('sanity').StudioTheme}`

    case 'import-static':
      return (first: string) => `// Add this URL ESM import
import {theme} from ${first}`

    case 'studio-config':
      return (first: string) => `// Add two lines of code to your workspace
import {createConfig} from 'sanity'
import {deskTool} from 'sanity/desk'

import {schemaTypes} from './schemas'

// 1. Add the import
${first}

export default createConfig({
  theme, // <-- 2. add the theme here

  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: {types: schemaTypes}
})`

    case 'sanity.cli.ts':
      return () => `// Change target to allow top-level await in sanity.config.ts
import {createCliConfig} from 'sanity/cli'
import type {UserConfig} from 'vite'

export default createCliConfig({
  api: {projectId: 'b5vzhxkv', dataset: 'production'},
  vite: (config: UserConfig): UserConfig => ({
    ...config,
    build: {...config.build, target: 'esnext'}
  })
})`

    case 'sanity.cli.js':
      return () => `// Change target to allow top-level await in sanity.config.js
import {createCliConfig} from 'sanity/cli'

export default createCliConfig({
  api: {projectId: 'b5vzhxkv', dataset: 'production'},
  vite: config => ({...config, build: {...config.build, target: 'esnext'}})
})`

    case 'studio-config-create-theme':
      return (
        first: string
      ) => `// Import createTheme and hues to quickly modify your theme without changing the import URL
import {createConfig} from 'sanity'
import {deskTool} from 'sanity/desk'

import {schemaTypes} from './schemas'

${first}

export default createConfig({
  theme: createTheme({...hues, primary: {...hues.primary, mid: '#22fca8'}}),

  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: {types: schemaTypes}
})`

    case 'import-create-theme-static':
      return (first: string) => `import {createTheme, hues} from ${first}`

    case 'import-create-theme-dynamic':
      return (first: string) => `const {createTheme, hues} = await import(
  ${first}
)`

    case 'themer.d.ts':
      return (first: string) => `module ${first} {
  interface Hue extends Omit<import('@sanity/color').ColorHueConfig, 'title' | 'midPoint'> {
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
}`

    case 'tsconfig':
      return () => `{
  "compilerOptions": {
    // target needs to be es2017 or newer to allow top-level await
    "target": "es2017",

    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`

    case '_document.tsx':
      return (
        first: string
      ) => `// As Studio v3 is in developer preview there's not yet a simple way to just add a <link> tag to the <head>
// Thus we have to re-implement DefaultDocument to make it happen.
// Expect this to get much easier before v3 hits stable

import React from 'react'
import {type DefaultDocumentProps} from 'sanity'
import {GlobalErrorHandler} from 'sanity/_unstable'

const globalStyles = ${'`'}
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
${'`'}

interface FaviconProps {
  basePath: string
}

function Favicons({basePath}: FaviconProps) {
  const base = ${'`'}${'${'}basePath.replace(${/\/+$/}, '')}/static${'`'}
  return (
    <>
      <link rel="icon" href={${'`'}${'${'}base}/favicon.ico${'`'}} sizes="any" />
      <link rel="icon" href={${'`'}${'${'}base}/favicon.svg${'`'}} type="image/svg+xml" />
      <link rel="apple-touch-icon" href={${'`'}${'${'}base}/apple-touch-icon.png${'`'}} />
      <link rel="manifest" href={${'`'}${'${'}base}/manifest.webmanifest${'`'}} />
    </>
  )
}

const EMPTY_ARRAY: never[] = []
export default function DefaultDocument(props: DefaultDocumentProps): React.ReactElement {
  const {entryPath, css = EMPTY_ARRAY, basePath = '/'} = props
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="robots" content="noindex" />
        <meta name="referrer" content="same-origin" />
        {/* This is the only line of code we're adding that is different from the default implementation of DefaultDocument */}
        <link
          rel="modulepreload"
          href={${first}}
        />

        <Favicons basePath={basePath} />

        <title>Sanity Studio</title>

        <GlobalErrorHandler />

        {css.map(href => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <style>{globalStyles}</style>
      </head>
      <body>
        <div id="sanity" />
        <script type="module" src={entryPath} />
      </body>
    </html>
  )
}`

    default:
      throw new TypeError('Unknown snippet id: ' + id)
  }
}
