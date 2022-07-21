// @ts-check
// Compiles snippets so they have prettier formatting pre-applied

import parserTypescript from 'prettier/esm/parser-typescript.mjs'
import prettier from 'prettier/esm/standalone.mjs'
import writeFileAtomic from 'write-file-atomic'

const options = {
  parser: 'typescript',
  plugins: [parserTypescript],
  semi: false,
  trailingComma: 'none',
}

const args = ['first', 'second']
const dummies = {
  esmUrl: `/* @dummy */ ${JSON.stringify('https://example.com/api/hues')}`,
  themeConfigProperty: '/* @dummy */ theme,',
  import: `/* @dummy */
import { studioTheme as theme } from "@sanity/ui"`,
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
    `import { createConfig } from 'sanity'
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
    'cli-config',
    [],
    `import { createCliConfig } from 'sanity/cli'
    import { type UserConfig } from "vite";
    
    export default createCliConfig({
      api: {
        projectId: 'b5vzhxkv',
        dataset: 'production',
      },
      vite: (config): UserConfig => {
        return {
          ...config,
          build: {
            ...config.build,
            // Change minify and target to allow top-level await in sanity.config.ts
            minify: 'esbuild',
            target: "esnext"
          },
        };
      },
    })
    
`,
  ],
  [
    'studio-config-create-theme',
    ['import'],
    `import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './schemas'

${dummies.import}

export default createConfig({
  theme: createTheme({
    // override just the bits you want to iterate on
    ...hues, primary: { ...hues.primary, mid: '#22fca8' } 
  }),

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
    `// Use createTheme and hues to iterate locally without needing to mess with URLs
import { createTheme, hues } from ${dummies.esmUrl};
`,
  ],
  [
    'import-create-theme-dynamic',
    ['esmUrl'],
    `// Use createTheme and hues to iterate locally without needing to mess with URLs
const { createTheme, hues } = await import(${dummies.esmUrl});
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
]

// Sanity check
const idsChecked = new Set()
for (const [id] of snippets) {
  if (idsChecked.has(id)) {
    throw new Error(`Duplicate id: ${id}`)
  }
  idsChecked.add(id)
}

const ids = snippets.map(([id]) => id)
const idsType = ids.map((id) => JSON.stringify(id)).join(' | ')
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
const cases = snippets.map(([id, placeholders, snippet]) => {
  console.group('prettier')
  let code = prettier.format(snippet, options).trim()
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
  const template = `
  case ${JSON.stringify(id)}:
    return (${getArgs(placeholders.length)}) => \`${code}\`
  `
  console.log(template)
  console.groupEnd()
  return template
})
console.groupCollapsed()

const codeSnippets = `
// Automatically generated by running \`npm run build:snippets\`

export type SnippetId = ${idsType};

export function snippet(id: SnippetId) {
  switch (id) {
    ${cases.join('\n')}
    default:
      throw new TypeError('Unknown snippet id: ' + id);
  }
}
`

const dest = new URL('../utils/snippets.ts', import.meta.url)
await writeFileAtomic(dest.pathname, codeSnippets)
