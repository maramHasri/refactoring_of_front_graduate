const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

function readResponseMessage(data) {
  if (!data) return null
  if (typeof data === 'string') return data
  return data.message || data.error || data.detail || null
}

export function parseApiError(error) {
  if (error?.response) {
    const { status, data } = error.response
    const apiMessage = readResponseMessage(data)

    if (apiMessage) return apiMessage
    if (status === 401) return 'بيانات الدخول غير صحيحة'
    if (status === 403) return 'ليس لديك صلاحية لهذا الإجراء'
    if (status === 404) return 'المسار المطلوب غير موجود على الخادم'
    if (status >= 500) return 'خطأ داخلي في الخادم — حاول لاحقاً'
    return `خطأ من الخادم (${status})`
  }

  if (error?.request) {
    const code = error.code || ''
    const isNetwork =
      error.message === 'Network Error' ||
      code === 'ERR_NETWORK' ||
      code === 'ECONNABORTED'

    if (isNetwork) {
      return `تعذّر الاتصال بالخادم (${API_BASE_URL}). تأكد أن الباكند يعمل وأن العنوان صحيح.`
    }

    return error.message || 'تعذّر الاتصال بالخادم'
  }

  return error?.message || 'حدث خطأ غير متوقع'
}

export function logApiError(error, config) {
  if (!import.meta.env.DEV) return

  const method = config?.method?.toUpperCase() || 'REQUEST'
  const url = config?.baseURL
    ? `${config.baseURL}${config.url || ''}`
    : config?.url || 'unknown'

  console.groupCollapsed(`[API Error] ${method} ${url}`)
  console.error('message:', error?.message)
  console.error('code:', error?.code)
  console.error('status:', error?.response?.status)
  console.error('response:', error?.response?.data)
  console.error('full error:', error)
  console.groupEnd()
}
