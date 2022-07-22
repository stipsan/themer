import type { ResizeObserverEntry } from '@juggle/resize-observer'
import { ResizeObserver } from '@juggle/resize-observer'
import {
  Badge,
  Box,
  Card,
  Dialog,
  Flex,
  Grid,
  Inline,
  Stack,
  Text,
} from '@sanity/ui'
import CodeSnippet from 'components/CodeSnippet'
import type { QuizDispatch, QuizState } from 'components/ExportTheme'
import { Button, Label } from 'components/Sidebar.styles'
import { useIdleCallback } from 'hooks/useIdleCallback'
import { animate, spring } from 'motion'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import { snippet } from 'utils/snippets'

interface QuizRowProps {
  children: ReactNode
  text: ReactNode
}
export const QuizRow = ({ children, text }: QuizRowProps) => {
  return (
    <TransitionHeight>
      <Stack space={2} paddingBottom={4}>
        <Text muted size={1}>
          {text}
        </Text>
        <Inline space={1}>{children}</Inline>
      </Stack>
    </TransitionHeight>
  )
}

export const QuizButton = styled(Button).attrs({ mode: 'bleed' })``

type TransitionHeightProps = {
  children: ReactNode
}
export const TransitionHeight = ({ children }: TransitionHeightProps) => {
  const [height, setHeight] = useState(0)
  const animated = useRef<HTMLDivElement>(null)
  const observed = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    animated.current.style.height = '0px'
    const handleResize = (entries: ResizeObserverEntry[]) => {
      setHeight(entries[0].borderBoxSize[0].blockSize)
    }
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(observed.current, { box: 'border-box' })

    return () => resizeObserver.disconnect()
  }, [])

  useLayoutEffect(() => {
    const options = {
      overflow: ['hidden', 'visible'],
      height: `${height}px`,
    }
    animate(animated.current, options, { easing: spring() })
    console.log('animate', 'instant', animated.current.style.overflow, options)
  }, [height])

  return (
    <div ref={animated}>
      <div ref={observed}>{children}</div>
    </div>
  )
}

type TransitionMinHeightProps = {
  children: ReactNode
}
export const TransitionMinHeight = ({ children }: TransitionMinHeightProps) => {
  const [minHeight, setMinHeight] = useState(0)
  const animated = useRef<HTMLDivElement>(null)
  const observed = useRef<HTMLDivElement>(null)
  const handleResize = useIdleCallback(
    useCallback(
      (entries: ResizeObserverEntry[]) =>
        setMinHeight(entries[0].borderBoxSize[0].blockSize),
      []
    )
  )
  const startAnimation = useIdleCallback(
    useCallback(() => {
      const options = { minHeight: `${minHeight}px` }
      animate(animated.current, options, { easing: spring() })
      console.log('animate', 'delayed', animated.current, options)
    }, [minHeight])
  )

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(observed.current, { box: 'border-box' })

    return () => resizeObserver.disconnect()
  }, [handleResize])

  useEffect(() => void startAnimation(), [startAnimation])

  return (
    <div ref={animated}>
      <div ref={observed}>{children}</div>
    </div>
  )
}

interface FilesViewerProps {
  files: { filename: string; contents: string }[]
  initial: string
  lead: ReactNode
}
export const FilesViewer = ({ lead, files, initial }: FilesViewerProps) => {
  const [open, setOpen] = useState(initial)
  const active = useMemo(
    () => files.find(({ filename }) => filename === open),
    [files, open]
  )

  // Allow a viewer to be initially open while toggling typescript on/off
  useLayoutEffect(() => void setOpen(initial), [initial])

  return (
    <TransitionHeight>
      <Box>
        <TransitionMinHeight>
          <Text size={1}>
            <Flex
              paddingTop={1}
              paddingBottom={3}
              gap={1}
              wrap="wrap"
              align="center"
            >
              {lead}
            </Flex>
          </Text>
        </TransitionMinHeight>
        <Card tone="transparent" shadow={1} radius={2}>
          <Card tone="default" padding={3} radius={2}>
            <Inline space={1}>
              {files.map(({ filename }) => (
                <Button
                  key={filename}
                  mode="bleed"
                  text={filename}
                  selected={filename === open}
                  onClick={() =>
                    setOpen((open) => (open === filename ? null : filename))
                  }
                />
              ))}
            </Inline>
          </Card>
          {active && <CodeSnippet>{active.contents}</CodeSnippet>}
        </Card>
      </Box>
    </TransitionHeight>
  )
}
