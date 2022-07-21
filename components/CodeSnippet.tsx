import { Card, Code, Skeleton } from '@sanity/ui'
import { useFormatted } from 'hooks/usePrettier'
import { memo, Suspense } from 'react'

interface Props {
  children: string
}
const CodeSnippet = ({ children }: Props) => {
  const prettyCode = useFormatted(children)
  return (
    <Card overflow="auto" padding={4} radius={2} shadow={1}>
      <Code language="ts">{prettyCode}</Code>
    </Card>
  )
}

const CodeSnippetSuspense = (props: Props) => (
  <Suspense fallback={<Skeleton animated padding={4} radius={2} />}>
    <CodeSnippet {...props} />
  </Suspense>
)

export default memo(CodeSnippet)
