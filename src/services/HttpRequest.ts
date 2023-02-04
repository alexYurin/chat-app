const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const

type RequestOptionsType =
  | {
      method: keyof typeof METHODS
      headers?: Record<string, string>
      data?: Record<string, unknown>
      timeout?: number
    }
  | Record<string, never>

function queryStringify(data: RequestOptionsType['data']) {
  if (data) {
    return Object.entries(data)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&')
  }

  return ''
}

export default class HTTPRequest {
  get(url: string, options: RequestOptionsType = {}) {
    url = options.data ? `${url}?${queryStringify(options.data)}` : url

    return this.request(
      url,
      { ...options, method: METHODS.GET },
      options.timeout
    )
  }

  post(url: string, options: RequestOptionsType = {}) {
    return this.request(
      url,
      { ...options, method: METHODS.POST },
      options.timeout
    )
  }

  put(url: string, options: RequestOptionsType = {}) {
    return this.request(
      url,
      { ...options, method: METHODS.PUT },
      options.timeout
    )
  }

  delete(url: string, options: RequestOptionsType = {}) {
    return this.request(
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

      xhr.open(method, url)

      xhr.timeout = timeout

      Object.entries(options.headers || {}).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value)
      })

      xhr.onabort = reject || handleError
      xhr.onerror = reject || handleError
      xhr.ontimeout = reject || handleError

      xhr.onload = function () {
        if (xhr.status != 200) {
          return reject(xhr)
        } else {
          return resolve(xhr.response)
        }
      }

      if (method === METHODS.GET || !data) {
        xhr.send()
      } else {
        xhr.send(JSON.stringify(data))
      }

      return xhr
    })
  }
}
