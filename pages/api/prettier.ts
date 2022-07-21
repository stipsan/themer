import { format } from 'edge-utils/prettier.mjs'
import type { NextRequest } from 'next/server'
import { type ServerTimingInstance, ServerTiming } from 'utils/ServerTiming'

export const config = {
  runtime: 'experimental-edge',
}

const headers = (serverTiming: ServerTimingInstance) => ({
  'Access-Control-Allow-Origin': '*',
  // Test https://vercel.com/docs/concepts/functions/serverless-functions/edge-caching#stale-while-revalidate
  'Cache-Control':
    'public, max-age=31536000, s-maxage=1, stale-while-revalidate',
  'Content-Type': 'text/plain; charset=utf-8',
  'Server-Timing': `${serverTiming}`,
})

export default async function handler(req: NextRequest) {
  const serverTiming = new ServerTiming()
  serverTiming.start('handler')
  const { searchParams } = new URL(req.url)

  serverTiming.start('prettier')
  const code = decodeURIComponent(searchParams.get('code')) || ''
  try {
    /*
    const [{ default: prettier }, { default: parserTypescript }] =
      await Promise.all([
        import(
           '../../node_modules/prettier/esm/standalone.mjs'
        ) as Promise<{
          default: typeof import('prettier')
        }>,
        import(
           '../../node_modules/prettier/esm/parser-typescript.mjs'
        ) as Promise<{
          default: typeof import('prettier/parser-typescript')
        }>,
      ])
    const prettyCode = prettier.format(code, {
      semi: false,
      singleQuote: true,
      trailingComma: 'none',
      parser: 'typescript',
      plugins: [parserTypescript],
    })
    // */
    const prettierCode = format(code)
    return new Response(prettierCode, { headers: headers(serverTiming) })
  } catch (err) {
    console.error('Failed to prettify code', err, searchParams.get('code'))
    return new Response(`${err}`, { headers: headers(serverTiming) })
  }
}
