import type { NextRequest } from 'next/server'
import _parserTypescript from 'prettier/esm/parser-typescript.mjs'
import _prettier from 'prettier/esm/standalone.mjs'
import { type ServerTimingInstance, ServerTiming } from 'utils/ServerTiming'

const prettier = _prettier as typeof import('prettier')
const parserTypescript =
  _parserTypescript as typeof import('prettier/parser-typescript')

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
  const code = prettier.format(searchParams.get('code') || '', {
    semi: false,
    singleQuote: true,
    trailingComma: 'none',
    parser: 'typescript',
    plugins: [parserTypescript],
  })

  return new Response(code, { headers: headers(serverTiming) })
}
