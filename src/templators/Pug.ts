import pug from 'pug'
import BaseTemplator from './BaseTemplator'

export default class PugTemplator extends BaseTemplator {
  constructor(private templatorOptions: pug.Options = {}) {
    super('pug')
  }

  private createHTMLCompiler(template: string): ReturnType<typeof pug.compile> {
    return pug.compile(template.trim(), this.templatorOptions)
  }

  public compile(template: string, props: pug.LocalsObject) {
    const compileToHTML = this.createHTMLCompiler(template)

    return compileToHTML(props)
  }
}
