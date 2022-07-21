import { Badge, Box, Dialog, Grid, Inline, Stack, Text } from '@sanity/ui'
import CodeSnippet from 'components/CodeSnippet'
import type { QuizDispatch, QuizState } from 'components/ExportTheme'
import { Button, Label } from 'components/Sidebar.styles'
import { animate } from 'motion'
import { type ReactNode, useRef } from 'react'
import styled from 'styled-components'
import { snippet } from 'utils/snippets'

interface QuizRowProps {
  children: ReactNode
  text: ReactNode
}
export const QuizRow = ({ children, text }: QuizRowProps) => {
  return (
    <ExpandHeightOnReveal>
      <Stack space={2}>
        <Text muted size={1}>
          {text}
        </Text>
        <Inline space={1}>{children}</Inline>
      </Stack>
    </ExpandHeightOnReveal>
  )
}

export const QuizButton = styled(Button).attrs({ mode: 'bleed' })``

type ExpandHeightOnRevealProps = {
  children: ReactNode
}
export const ExpandHeightOnReveal = ({
  children,
}: ExpandHeightOnRevealProps) => {
  const ref = useRef(null)

  return <div ref={ref}>{children}</div>
}
