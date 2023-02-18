import Validation from 'components/Form/Validation'
import ChatLayout from 'layouts/Chat/index'

export default class ChatView {
  static pathname = '/messenger'

  constructor() {
    return new ChatLayout('chat', {
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
}
