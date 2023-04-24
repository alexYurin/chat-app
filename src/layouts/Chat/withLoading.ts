import BaseComponent, { BaseComponentProps } from 'components/Base'
import { BaseLayout } from 'layouts/Base'

export default function withLoading<
  T extends BaseComponent<BaseComponentProps>,
  K extends BaseLayout
>(loadingKey: keyof K) {
  return (
    target: T,
    property: string,
    descriptor: TypedPropertyDescriptor<
      (...args: unknown[]) => Promise<unknown>
    >
  ) => {
    const fetchHandler = descriptor.value

    descriptor.value = async function (this: T, ...args: unknown[]) {
      this.setProps({
        [loadingKey]: true,
      })

      try {
        const response = await fetchHandler?.apply(this, args)

        this.setProps({
          [loadingKey]: false,
        })

        return response
      } catch (error) {
        this.setProps({
          [loadingKey]: false,
        })

        return Promise.reject(error)
      }
    }

    return descriptor
  }
}
