import pug from 'pug'
import BaseRenderer from './BaseRenderer'

export default class PugRenderer extends BaseRenderer {
  constructor(private rendererOptions: pug.Options = {}) {
    super('pug')
  }

  private createHTMLCompiler(template: string): ReturnType<typeof pug.compile> {
    return pug.compile(template.trim(), this.rendererOptions)
  }

  toHTML(template: string, props: pug.LocalsObject) {
    const compileToHTML = this.createHTMLCompiler(template)

    return compileToHTML(props)
  }
}
