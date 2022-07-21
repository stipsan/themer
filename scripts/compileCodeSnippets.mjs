// @ts-check
// Compiles snippets so they have prettier formatting pre-applied

import JSON5 from 'json5'
import parserBabel from 'prettier/esm/parser-babel.mjs'
import parserTypescript from 'prettier/esm/parser-typescript.mjs'
import prettier from 'prettier/esm/standalone.mjs'
import writeFileAtomic from 'write-file-atomic'

const options = {
  arrowParens: 'avoid',
  parser: 'typescript',
  plugins: [parserTypescript],
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
}
const jsonOptions = {
  parser: 'json',
  plugins: [parserBabel],
}

const args = ['first', 'second']
const dummies = {
  esmUrl: `/* @dummy */ ${JSON5.stringify('https://example.com/api/hues')}`,
  themeConfigProperty: '/* @dummy */ theme,',
  import: `/* @dummy */
import { studioTheme as theme } from '@sanity/ui'`,
}

const snippets = [
  [
    'import-dynamic-js',
    ['esmUrl'],
    `
const {theme} = await import(${dummies.esmUrl})
`,
  ],
  [
    'import-dynamic-ts',
    ['esmUrl'],
    `
    const { theme } = (await import(
      // @ts-${'expect'}-error -- TODO setup themer.d.ts to get correct typings
      ${dummies.esmUrl}
    )) as { theme: import('sanity').StudioTheme }
`,
  ],
  [
    'import-static',
    ['esmUrl'],
    `
  // Add this URL ESM import
  import { theme } from ${dummies.esmUrl};
`,
  ],
  [
    'studio-config',
    ['import'],
    `
    // Add two lines of code to your workspace
import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './schemas'

// 1. Add the import
${dummies.import}

export default createConfig({
  theme, // <-- 2. add the theme here

  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemaTypes,},
})

`,
  ],
  [
    'sanity.cli.ts',
    [],
    `// Change target to allow top-level await in sanity.config.ts
    import { createCliConfig } from 'sanity/cli'
    import type { UserConfig } from "vite";
    
    export default createCliConfig({api: {projectId: 'b5vzhxkv',dataset: 'production'}, vite: (config: UserConfig): UserConfig => ({...config,build: {...config.build,target: "esnext"},})})
`,
  ],
  [
    'sanity.cli.js',
    [],
    `// Change target to allow top-level await in sanity.config.js
    import { createCliConfig } from 'sanity/cli'
    
    export default createCliConfig({api: {projectId: 'b5vzhxkv',dataset: 'production'},vite: (config) => ({...config, build: {...config.build,target: "esnext"},})})
`,
  ],
  [
    'studio-config-create-theme',
    ['import'],
    `// Import createTheme and hues to quickly modify your theme without changing the import URL
import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './schemas'

${dummies.import}

export default createConfig({
  theme: createTheme({...hues, primary: { ...hues.primary, mid: '#22fca8' } }),

  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemaTypes,},
})

`,
  ],
  [
    'import-create-theme-static',
    ['esmUrl'],
    `import { createTheme, hues } from ${dummies.esmUrl};
`,
  ],
  [
    'import-create-theme-dynamic',
    ['esmUrl'],
    `const { createTheme, hues } = await import(${dummies.esmUrl});
`,
  ],
  [
    'themer.d.ts',
    ['esmUrl'],
    `
    module ${dummies.esmUrl} {
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

  export { hues, createTheme, theme }
}

    `,
  ],
  [
    'tsconfig',
    [],
    `
  {
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
  }
  `,
    'json',
  ],
]

// Sanity check
const idsChecked = new Set()
for (const [id] of snippets) {
  if (idsChecked.has(id)) {
    throw new Error(`Duplicate id: ${id}`)
  }
  idsChecked.add(id)
}

const overloads = []
const getArgs = (argsLength) => {
  const input = args.map((_) => `${_}: string`)
  switch (argsLength) {
    case 1:
      return input[0]
    case 2:
      return [input[0], input[1]].join(', ')
    default:
      return ''
  }
}

console.group('snippets.map')
const cases = snippets.map(
  ([id, placeholders, snippet, format = 'typescript']) => {
    console.group('prettier')
    let code = prettier
      .format(snippet, format === 'json' ? jsonOptions : options)
      .trim()
    console.log(code)
    console.groupEnd()
    // @ts-expect-error -- dunno what to do with the typing of placeholders, maybe try the `const snippets = as const` trick?
    for (const i in placeholders) {
      const key = placeholders[i]
      const dummy = dummies[key]
      const arg = `\${${args[i]}}`
      code = code.replaceAll(dummy, arg)
    }
    console.group('template')
    const { length } = placeholders
    const argsString = getArgs(length)
    const callback = `(${getArgs(length)}) => \`${code}\``
    overloads.push(
      `export function snippet(id: ${JSON5.stringify(
        id
      )}): ${`(${argsString}) => string`}`
    )
    const template = `
  case ${JSON5.stringify(id)}:
    return ${callback}
  `
    console.log(template)
    console.groupEnd()
    return template
  }
)
console.groupCollapsed()

const codeSnippets = `
// Automatically generated by running \`npm run build:snippets\`

${overloads.join('\n')}
export function snippet(id) {
  switch (id) {
    ${cases.join('\n')}
    default:
      throw new TypeError('Unknown snippet id: ' + id);
  }
}
`

const dest = new URL('../utils/snippets.ts', import.meta.url)
await writeFileAtomic(dest.pathname, codeSnippets)
