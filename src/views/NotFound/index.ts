import PlaceholderLayout from 'layouts/Placeholder/index'

export default class NotFoundView {
  static id = 'notFound'
  static title = '404'
  static pathname = '/not-found'

  constructor() {
    return new PlaceholderLayout(NotFoundView.id, {
      title: '404',
      description: 'Не туда попали',
    })
  }
}
