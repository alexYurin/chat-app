import BaseHTTP from './BaseHttp'
import { assert, expect } from 'chai'

describe('HTTP', () => {
  describe('Создание экземпляра', () => {
    const baseHttp = new BaseHTTP(process.env.BASE_URL_API)

    // expect(baseHttp.request('')).to.be.an.instanceOf(XMLHttpRequest)
  })
})
