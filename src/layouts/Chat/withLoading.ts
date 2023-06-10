import BaseComponent, { BaseComponentProps } from 'components/Base'

export default function withLoading<
  TComponent extends BaseComponent<BaseComponentProps>,
  TResponse = any
>(loadingKey: string) {
  return (
    target: TComponent,
    property: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<TResponse>>
  ) => {
    const fetchHandler = descriptor?.value

    if (descriptor) {
      descriptor.value = async function (
        this: TComponent,
        ...args: any[]
      ): Promise<TResponse> {
        this.setProps({
          [loadingKey]: true,
        })

        try {
          const response = await fetchHandler?.apply(this, args)

          this.setProps({
            [loadingKey]: false,
          })

          return response as Promise<TResponse>
        } catch (error) {
          this.setProps({
            [loadingKey]: false,
          })

          return Promise.reject(error)
        }
      }
    }

    return descriptor
  }
}
