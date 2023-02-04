import routes from 'router/routes'
import Validation from 'components/Form/Validation'
import ChatLayout from 'layouts/Chat/index'

const { name, pathname, title } = routes.chat

export default {
  Layout: ChatLayout,
  props: {
    name,
    pathname,
    documentTitle: title,
    data: {
      title,
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
    },
  },
}
