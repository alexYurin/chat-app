import PlaceholderLayout from 'layouts/Placeholder/index'

export default class NotFoundView {
  static pathname = '/not-found'

  constructor() {
    return new PlaceholderLayout('notFound', {
      title: '404',
      description: 'Не туда попали',
    })
  }
}
