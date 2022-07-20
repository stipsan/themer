// Prettier is huge(!) when formatting TypeScript, thus we defer loading it until needed
import type { Options } from 'prettier'
import { suspend } from 'suspend-react'

export type UseFormattedOptions = Omit<Options, 'parser' | 'plugins'>
export function useFormatted(code: string, options: Options = null): string {
  return suspend(async () => {
    const [{ default: prettier }, { default: parserTypescript }] =
      await Promise.all([
        import('prettier/esm/standalone.mjs') as Promise<{
          default: typeof import('prettier')
        }>,
        import('prettier/esm/parser-typescript.mjs') as Promise<{
          default: typeof import('prettier/parser-typescript')
        }>,
      ])
    return prettier.format(code, {
      semi: false,
      singleQuote: true,
      trailingComma: 'none',
      ...options,
      parser: 'typescript',
      plugins: [parserTypescript],
    })
  }, [code, options])
}
