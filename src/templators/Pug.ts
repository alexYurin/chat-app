// import pug from 'pug'
import BaseTemplator from './BaseTemplator'

export type PugLocalsPropsType = Record<string, unknown>

export type PugTemplateCompileFunctionType = (
  locals?: PugLocalsPropsType
) => string

export default class PugTemplator extends BaseTemplator {
  constructor() {
    super('pug')
  }

  public compile(
    templateFunction: PugTemplateCompileFunctionType,
    props: PugLocalsPropsType
  ) {
    return templateFunction(props)
  }
}
