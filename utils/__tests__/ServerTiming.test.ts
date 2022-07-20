import { ServerTiming } from 'utils/ServerTiming'

test('creates a Server-Timing header', async () => {
  const serverTiming = new ServerTiming()
  serverTiming.start('handler')
  await new Promise((resolve) => setTimeout(resolve, 100))
  serverTiming.end('handler')

  const [dur] = serverTiming.toString().match(/\d+$/)
  expect(Number(dur)).toBeGreaterThanOrEqual(100)
  expect(`${serverTiming}`.replace(/\d+$/, '100')).toMatchInlineSnapshot(
    `"handler;dur=100"`
  )
})

test('Forgot to end a timing? We gotchu', async () => {
  const serverTiming = new ServerTiming()
  serverTiming.start('handler')
  serverTiming.start('fetch', 'GROQ query')
  await new Promise((resolve) => setTimeout(resolve, 100))
  serverTiming.end('handler')

  const [handlerDur, fetchDur] = serverTiming.toString().match(/\d+/g)
  expect(Number(handlerDur)).toBeGreaterThanOrEqual(100)
  expect(Number(fetchDur)).toBeGreaterThanOrEqual(100)
  expect(`${serverTiming}`.replace(/\d+/g, '100')).toMatchInlineSnapshot(
    `"handler;dur=100,fetch;desc=\\"GROQ query\\";dur=100"`
  )
})

test('No timings no stress', () => {
  expect(`${new ServerTiming()}`).toBe('')
})
