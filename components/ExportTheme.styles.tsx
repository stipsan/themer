import { Badge, Box, Dialog, Grid, Inline, Stack, Text } from '@sanity/ui'
import CodeSnippet from 'components/CodeSnippet'
import type { QuizDispatch, QuizState } from 'components/ExportTheme'
import { Button, Label } from 'components/Sidebar.styles'
import { type ReactNode } from 'react'
import styled from 'styled-components'
import { snippet } from 'utils/snippets'

interface QuizRowProps {
  text: ReactNode
  options: ReactNode
}
export const QuizRow = ({ text, options }: QuizRowProps) => {
  return (
    <Stack space={2}>
      <Text muted size={1}>
        {text}
      </Text>
      <Inline space={1}>{options}</Inline>
    </Stack>
  )
}

export const QuizButton = styled(Button).attrs({ mode: 'bleed' })``
