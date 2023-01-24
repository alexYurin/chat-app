import BaseTemplator from './BaseTemplator'
import PugTemplator from './Pug'
import { TemplatorType } from './BaseTemplator'

const DEFAULT_TEMPLATOR = process.env.HTML_TEMPLATOR as TemplatorType

const createTemplator = (templator: TemplatorType): BaseTemplator => {
  switch (templator) {
    case 'pug':
      return new PugTemplator({
        pretty: true,
      })

    default:
      throw new Error(`Unknown templator: ${templator}`)
  }
}

export default createTemplator(DEFAULT_TEMPLATOR)
