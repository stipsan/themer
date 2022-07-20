import { Code, Skeleton } from '@sanity/ui'
import { useFormatted } from 'hooks/usePrettier'
import { memo, Suspense } from 'react'

interface Props {
  children: string
}
const CodeSnippet = ({ children }: Props) => {
  const prettyCode = useFormatted(children)
  return (
    <Code language="ts" muted>
      {prettyCode}
    </Code>
  )
}

const CodeSnippetSuspense = (props: Props) => (
  <Suspense fallback={<Skeleton animated padding={4} radius={4} muted />}>
    <CodeSnippet {...props} />
  </Suspense>
)

export default memo(CodeSnippetSuspense)
