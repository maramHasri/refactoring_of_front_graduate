function decodeTokenPayload(token) {
  if (!token) return null

  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export function isAccessTokenExpired(token, bufferSeconds = 30) {
  const payload = decodeTokenPayload(token)
  if (!payload?.exp) return true
  return payload.exp * 1000 <= Date.now() + bufferSeconds * 1000
}

export function getAccessTokenExpiresAt(token) {
  const payload = decodeTokenPayload(token)
  return payload?.exp ? payload.exp * 1000 : null
}
