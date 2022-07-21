// Automatically generated by running `npm run build:snippets`

export type SnippetId = 'import-dynamic-js' | 'import-static' | 'studio-config'

export function snippet(id: SnippetId) {
  switch (id) {
    case 'import-dynamic-js':
      return (first: string) => `const { theme } = await import(${first})
`

    case 'import-static':
      return (first: string) => `// Add this URL ESM import
import { theme } from ${first}
`

    case 'studio-config':
      return (first: string) => `// sanity.config.ts
import { createConfig } from "sanity"
import { deskTool } from "sanity/desk"

import { schemaTypes } from "./schemas"

;(${first})

export default createConfig({
  theme, // <-- add the theme here

  name: "default",
  title: "My Sanity Project",
  projectId: "b5vzhxkv",
  dataset: "production",
  plugins: [deskTool()],
  schema: { types: schemaTypes }
})
`

    default:
      throw new TypeError('Unknown snippet id: ' + id)
  }
}
