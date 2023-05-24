import { BaseHttp } from 'services/index'

const BASE_URL = process.env.BASE_URL_API as string

export default class BaseApi extends BaseHttp {
  constructor() {
    super(BASE_URL)

    return this
  }
}
