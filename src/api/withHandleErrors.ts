import { Router, routes } from 'router/index'
import { store } from 'services/index'

export type WithHandleErrorsOptionsType = {
  withAppLoading?: boolean
  withRouteOnErrorPage?: boolean
}

export default function withHandleErrors<TArgs = unknown, TResponse = unknown>(
  options: WithHandleErrorsOptionsType = {}
) {
  return (
    target: object,
    key: string,
    descriptor: TypedPropertyDescriptor<
      (...args: any[]) => Promise<TResponse | any>
    >
  ) => {
    const fetchMethod = descriptor.value

    if (fetchMethod) {
      descriptor.value = async function (
        ...args: TArgs[]
      ): Promise<TResponse | any> {
        if (options?.withAppLoading) {
          store.set('isLoading', true)
        }

        try {
          const response = await fetchMethod.apply(this, args)

          return response
        } catch (error) {
          if (error instanceof XMLHttpRequest) {
            const response = JSON.parse(error.response)

            store.set('error', {
              status: error.status,
              message: response.reason || response.message,
            })
          } else {
            store.set('error', {
              status: 'Неизвестная ошибка',
              message: 'Упс, что-то пошло не так...',
            })
          }

          if (options?.withRouteOnErrorPage) {
            Router.navigate(routes.error.pathname)
          }
        } finally {
          if (options?.withAppLoading) {
            store.set('isLoading', false)
          }
        }
      }
    }

    return descriptor
  }
}
