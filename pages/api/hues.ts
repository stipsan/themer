import { themeFromHuesTemplate } from 'edge-utils/themeFromHuesTemplate.mjs'
import type { NextRequest } from 'next/server'
import { parseHuesFromSearchParams } from 'utils/parseHuesFromSearchParams'
import { ValidationError } from 'utils/ValidationError'

export const config = {
  runtime: 'experimental-edge',
}

const headers = (timing) => ({
  'access-control-allow-origin': '*',
  // @TODO force no caching until we have a better solution that limits bandwidth without causing trouble
  // 'cache-control': 'no-cache',
  // Test https://vercel.com/docs/concepts/functions/serverless-functions/edge-caching#stale-while-revalidate
  'cache-control': `s-maxage=1, stale-while-revalidate`,
  'content-type': 'application/javascript; charset=utf-8',
  'server-timing': timing,
})

const handlerStart = Date.now()
export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  try {
    const resStart = Date.now()
    const res = themeFromHuesTemplate(
      parseHuesFromSearchParams(searchParams),
      searchParams.has('min')
    )
    const resDur = Date.now() - resStart
    return new Response(res, {
      headers: headers(
        `handler;desc="handler()";dur=${
          Date.now() - handlerStart
        },res;desc="themeFromHuesTemplate()";dur=${resDur}`
      ),
    })
  } catch (err) {
    if (err instanceof ValidationError) {
      return new Response(
        `throw new TypeError(${JSON.stringify(err.message)})`,
        {
          headers: headers(
            `handler;desc="handler()";dur=${Date.now() - handlerStart}`
          ),
        }
      )
    }
    throw err
  }
}
