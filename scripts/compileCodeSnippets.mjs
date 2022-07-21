// @ts-check
// Compiles snippets so they have prettier formatting pre-applied

import writeFileAtomic from 'write-file-atomic'
import parserTypescript from 'prettier/esm/parser-typescript.mjs'
import prettier from 'prettier/esm/standalone.mjs'

const keys = ['__FIRST__', '__SECOND__'].map((_) => JSON.stringify(_))
const args = ['first', 'second']

const sanityConfigCode = (
  themeImport,
  themeConfig = 'theme,'
) => `// sanity.config.ts
import { createConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

import { schemaTypes } from './schemas'

${themeImport}

export default createConfig({
  ${themeConfig}

  name: 'default',
  title: 'My Sanity Project',
  projectId: 'b5vzhxkv',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemaTypes,},
})

`

const snippets = [
  [
    'theme-import-1',
    1,
    `
const {theme} = await import(${keys[0]})
`,
  ],
  [
    'theme-import-2',
    1,
    `
  // Add this URL ESM import
  import { theme } from ${keys[0]};
`,
  ],
  [
    'theme-config-1',
    1,
    sanityConfigCode(keys[0], 'theme, // <-- add the theme here'),
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

const cases = snippets.map(([id, args, snippet]) => {
  let code = prettier.format(snippet, {
    parser: 'typescript',
    plugins: [parserTypescript],
    semi: false,
    trailingComma: 'none',
  })
  for (const i in keys) {
    const key = keys[i]
    const arg = `\${JSON.stringify(${args[i]})}`
    code = code.replace(key, arg)
  }
  return `
  case ${JSON.stringify(id)}:
    return (${getArgs(args)}) => \`${code}\`
  `
})

const codeSnippets = `
export type SnippetId = ${idsType};

export function snippet(id: SnippetId, first?: string, second?: string) {
  switch (id) {
    ${cases.join('\n')}
    default:
      throw new TypeError('Unknown snippet id: ' + id);
  }
}
`

const dest = new URL('../utils/snippets.ts', import.meta.url)
await writeFileAtomic(dest.pathname, codeSnippets)
