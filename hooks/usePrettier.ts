// Prettier is huge(!) when formatting TypeScript, thus we defer loading it until needed
import { useFetcher } from 'utils/fetcher'

export function useFormatted(code: string): string {
  return useFetcher(`/api/prettier?code=${encodeURIComponent(code)}`)
}
