import NextHead from 'next/head'
import favicon from 'public/favicon.svg'
import { memo } from 'react'

interface Props {
  lightest: string
  darkest: string
}
function Head({ lightest, darkest }: Props) {
  return (
    <NextHead>
      <title>Themer | Create Sanity Studio v3 themes 🪄</title>
      <meta name="theme-color" content={lightest} />
      <meta
        name="theme-color"
        content={darkest}
        media="(prefers-color-scheme: dark)"
      />
      <link rel="shortcut icon" type="image/svg" href={favicon.src} />
    </NextHead>
  )
}

export default memo(Head)
