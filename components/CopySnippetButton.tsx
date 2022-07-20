import { ClipboardIcon } from '@sanity/icons'
import { useToast } from '@sanity/ui'
import { Button } from 'components/Sidebar.styles'
import { useFormatted } from 'hooks/usePrettier'
import { type ReactNode } from 'react'

interface Props {
  text: ReactNode
  code: string
  toastTitle: string
}
export default function CopySnippetButton({ text, code, toastTitle }: Props) {
  const { push: pushToast } = useToast()
  const prettyCode = useFormatted(code)

  return (
    <Button
      icon={ClipboardIcon}
      text={text}
      onClick={() => {
        navigator.clipboard.writeText(prettyCode)
        pushToast({
          closable: true,
          status: 'success',
          title: toastTitle,
        })
      }}
    />
  )
}
