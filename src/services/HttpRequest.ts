const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
}

/**
 * Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
 * На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
 * На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
 */
function queryStringify(data) {
  // Можно делать трансформацию GET-параметров в отдельной функции
  return Object.entries(data)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
}

class HTTPTransport {
  get(url, options = {}) {
    url = options.data ? `${url}?${queryStringify(options.data)}` : url

    return this.request(
      url,
      { ...options, method: METHODS.GET },
      options.timeout
    )
  }

  // PUT, POST, DELETE
  /*post(url, options = {}) {
    return this.request(
      url,
      { ...options, method: METHODS.POST },
      options.timeout
    )
  }

  put(url, options = {}) {
    return this.request(
      url,
      { ...options, method: METHODS.PUT },
      options.timeout
    )
  }

  delete(url, options = {}) {
    return this.request(
      url,
      { ...options, method: METHODS.DELETE },
      options.timeout
    )
  }*/

  // options:
  // headers — obj
  // data — obj
  request(
    url,
    options = {
      method: 'GET',
    },
    timeout = 5000
  ) {
    const { method, data } = options

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      const handleError = (xhr) => {
        console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`)

        return xhr
      }

      xhr.open(method, url)

      xhr.timeout = timeout

      Object.entries(options.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value)
      })

      xhr.onabort = reject || handleError
      xhr.onerror = reject || handleError
      xhr.ontimeout = reject || handleError

      xhr.onload = function () {
        if (xhr.status != 200) {
          return handleError(xhr)
        } else {
          return resolve(xhr.response)
        }
      }

      if (method === METHOD.GET || !data) {
        xhr.send()
      } else {
        xhr.send(data)
      }

      return xhr
    })
  }
}
