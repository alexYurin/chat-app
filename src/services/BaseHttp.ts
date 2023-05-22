import { queryStringify } from 'utils/index'

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const

const DEFAULT_TIMEOUT = 5000

export type RequestOptionsType<
  TData = Record<string, string | number | string[] | number[]> | FormData
> = {
  method?: keyof typeof METHODS
  headers?: Record<string, string>
  data?: TData
  timeout?: number
}

export type HTTPMethodType = <TResponse>(
  url: string,
  options?: RequestOptionsType
) => Promise<TResponse>

const isFormData = (data: unknown): data is FormData => {
  return data instanceof FormData
}

export default class BaseHTTP {
  constructor(private baseURL?: string) {
    return this
  }

  get: HTTPMethodType = (url, options = {}) => {
    url = options.data ? `${url}?${queryStringify(options.data)}` : url

    return this.request(url, {
      ...options,
      timeout: options.timeout,
      method: METHODS.GET,
    })
  }

  post: HTTPMethodType = (url, options = {}) => {
    return this.request(url, {
      ...options,
      timeout: options.timeout,
      method: METHODS.POST,
    })
  }

  put: HTTPMethodType = (url, options = {}) => {
    return this.request(url, {
      ...options,
      timeout: options.timeout,
      method: METHODS.PUT,
    })
  }

  delete: HTTPMethodType = (url, options = {}) => {
    return this.request(url, {
      ...options,
      timeout: options.timeout,
      method: METHODS.DELETE,
    })
  }

  request: HTTPMethodType = (
    url,
    options = {
      method: METHODS.GET,
      headers: {},
      data: {},
      timeout: DEFAULT_TIMEOUT,
    }
  ) => {
    const { method, data } = options

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      const handleError = (xhr: XMLHttpRequest) => {
        console.log(`Error ${xhr.status}: ${xhr.statusText}`)

        return xhr
      }

      xhr.open(method || 'GET', `${this.baseURL || ''}/${url}`)

      xhr.withCredentials = true

      xhr.timeout = options.timeout || DEFAULT_TIMEOUT

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
