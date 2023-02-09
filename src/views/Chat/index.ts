import routes from 'router/routes'
import Validation from 'components/Form/Validation'
import ChatLayout from 'layouts/Chat/index'

const { name, pathname, title } = routes.chat

const createView = () => {
  return new ChatLayout(name, {
    fields: [
      {
        label: '',
        input: {
          name: 'message',
          type: 'text',
          value: '',
          validation: Validation.rules.message,
        },
      },
    ],
    submitButtonText: 'Отправить',
  })
}

export type ViewChatType = ReturnType<typeof createView>

export default {
  title,
  pathname,
  createView,
}
