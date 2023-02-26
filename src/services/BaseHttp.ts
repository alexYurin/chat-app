const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const

type RequestOptionsType<TData = Record<string, string | number> | FormData> = {
  method?: keyof typeof METHODS
  headers?: Record<string, string>
  data?: TData
  timeout?: number
}

const queryStringify = (data: RequestOptionsType['data']) => {
  if (data) {
    return Object.entries(data)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&')
  }

  return ''
}

const isFormData = (data: unknown): data is FormData => {
  return data instanceof FormData
}

export default class BaseHTTP {
  constructor(private baseURL?: string) {
    return this
  }

  get<TResponse>(url: string, options: RequestOptionsType = {}) {
    url = options.data ? `${url}?${queryStringify(options.data)}` : url

    return this.request<TResponse>(
      url,
      { ...options, method: METHODS.GET },
      options.timeout
    )
  }

  post<TResponse>(url: string, options: RequestOptionsType = {}) {
    return this.request<TResponse>(
      url,
      { ...options, method: METHODS.POST },
      options.timeout
    )
  }

  put<TResponse>(url: string, options: RequestOptionsType = {}) {
    return this.request<TResponse>(
      url,
      { ...options, method: METHODS.PUT },
      options.timeout
    )
  }

  delete<TResponse>(url: string, options: RequestOptionsType = {}) {
    return this.request<TResponse>(
      url,
      { ...options, method: METHODS.DELETE },
      options.timeout
    )
  }

  request<TResponse>(
    url: string,
    options: RequestOptionsType = {
      method: METHODS.GET,
      headers: {},
      data: {},
    },
    timeout = 5000
  ): Promise<TResponse> {
    const { method, data } = options

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      const handleError = (xhr: XMLHttpRequest) => {
        console.log(`Error ${xhr.status}: ${xhr.statusText}`)

        return xhr
      }

      xhr.open(method || 'GET', `${this.baseURL || ''}/${url}`)

      xhr.withCredentials = true

      xhr.timeout = timeout

      Object.entries(options.headers || {}).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value)
      })

      xhr.onabort = reject || handleError
      xhr.onerror = reject || handleError
      xhr.ontimeout = reject || handleError

      xhr.onload = function () {
        const isSuccess = xhr.status === 200 || xhr.status === 201

        if (isSuccess) {
          try {
            return resolve(JSON.parse(xhr.response))
          } catch {
            return resolve(xhr.response)
          }
        }

        return reject(xhr)
      }

      if (method === METHODS.GET || !data) {
        xhr.send()
      } else {
        xhr.send(isFormData(data) ? data : JSON.stringify(data))
      }

      return xhr
    })
  }
}
