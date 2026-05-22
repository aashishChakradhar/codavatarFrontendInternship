export async function fetchJson<T = any>(
  input: RequestInfo,
  init?: RequestInit
) {
  const response = await fetch(input, init)
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) {
    const errMsg = (data && (data.message || data.error)) || response.statusText
    throw new Error(errMsg || `HTTP ${response.status}`)
  }
  return data as T
}

export default fetchJson
