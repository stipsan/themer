
export type SnippetId = "theme-import-1" | "theme-import-2" | "theme-config-1";

export function snippet(id: SnippetId, first?: string, second?: string) {
  switch (id) {
    
  case "theme-import-1":
    return (first: string) => `const { theme } = await import(${JSON.stringify(undefined)})
`
  /n
  case "theme-import-2":
    return (first: string) => `// Add this URL ESM import
import { theme } from ${JSON.stringify(undefined)}
`
  /n
  case "theme-config-1":
    return (first: string) => `// sanity.config.ts
import { createConfig } from "sanity"
import { deskTool } from "sanity/desk"

import { schemaTypes } from "./schemas"

;(${JSON.stringify(undefined)})

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
      throw new TypeError('Unknown snippet id: ' + id);
  }
}
