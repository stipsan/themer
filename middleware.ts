import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = new URL(
    `${req.nextUrl.pathname}${req.nextUrl.search}`,
    'https://themer.sanity.build'
  )
  return NextResponse.redirect(url)
}
