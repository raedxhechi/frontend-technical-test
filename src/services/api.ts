const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3005'

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init)

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

export function get<T>(path: string): Promise<T> {
  return fetchJson<T>(path)
}
