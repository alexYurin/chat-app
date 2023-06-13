import { useFakeXMLHttpRequest, SinonFakeXMLHttpRequest } from 'sinon'
import BaseHTTP from './BaseHttp'
import { expect } from 'chai'

describe('HTTP', () => {
  describe('Проверка методов BaseHttp', () => {
    const xhr = useFakeXMLHttpRequest()

    let request: SinonFakeXMLHttpRequest

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.XMLHttpRequest = xhr

    xhr.onCreate = (xhrRequest: SinonFakeXMLHttpRequest) => {
      request = xhrRequest
    }

    const baseHttp = new BaseHTTP(process.env.BASE_URL_API)

    it('Метод .get() должен делать GET запрос', () => {
      baseHttp.get('/user')

      expect(request.method).to.eq('GET')
    })
  })
})
