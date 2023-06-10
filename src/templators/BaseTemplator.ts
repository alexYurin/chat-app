export type TemplatorType = 'pug'

export default abstract class BaseTemplator {
  constructor(public name: TemplatorType) {
    return this
  }

  public abstract compile<T extends object>(template: any, props: T): string
}
