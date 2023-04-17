import { Router, routes } from 'router/index'
import { store } from 'services/index'

export default function fetchDecorator<TArgs = unknown, TResponse = unknown>() {
  return (
    target: object,
    key: string,
    descriptor: TypedPropertyDescriptor<
      (...args: TArgs[]) => Promise<TResponse>
    >
  ) => {
    const fetchMethod = descriptor.value

    if (fetchMethod) {
      descriptor.value = async function (...args: TArgs[]) {
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

          Router.navigate(routes.error.pathname)

          console.error(`Error from method: ${key}`, target)

          return error
        }
      }
    }

    return descriptor
  }
}
