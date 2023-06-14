export type TemplatorType = 'pug'

export default abstract class BaseTemplator {
  constructor(public name: TemplatorType) {
    return this
  }

  public abstract compile<T extends Record<string, unknown>>(
    template: unknown,
    props: T
  ): string
}
