import { Card, Code } from '@sanity/ui'
import { useFormatted } from 'hooks/usePrettier'
import { memo } from 'react'
import styled from 'styled-components'

const StyledCard = styled(Card)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`

interface Props {
  children: string
}
const CodeSnippet = ({ children }: Props) => {
  const prettyCode = useFormatted(children)
  return (
    <StyledCard
      overflow="auto"
      tone="transparent"
      padding={4}
      radius={2}
      shadow={1}
    >
      <Code language="ts">{prettyCode}</Code>
    </StyledCard>
  )
}

export default memo(CodeSnippet)
