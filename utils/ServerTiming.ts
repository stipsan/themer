// Implements https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing

// @TODO regex check if `id` is ascii letters according to the Server-Timing spec

export class ServerTiming {
  #started = new Map<string, number>()
  #ended = new Map<string, number>()
  #desc = new Map<string, string>()

  start(id: string, desc?: string) {
    this.#started.set(id, Date.now())
    if (desc) {
      this.#desc.set(id, desc)
    }
  }

  end(id: string) {
    this.#ended.set(id, Date.now())
  }

  toString() {
    const timings: string[] = []
    for (const [id, start] of this.#started) {
      const end = this.#ended.has(id) ? this.#ended.get(id) : Date.now()
      const dur = end - start
      const desc = this.#desc.has(id)
        ? JSON.stringify(this.#desc.get(id))
        : null
      const timing = `${id}${desc ? `;desc=${desc}` : ''};dur=${dur}`
      timings.push(timing)
    }
    return timings.join(',')
  }
}
