import PlaceholderLayout from 'layouts/Placeholder/index'

export default class ErrorView {
  static id = 'error'
  static title = '500'
  static pathname = '/error'
  static allowedPaths = []

  constructor() {
    return new PlaceholderLayout(ErrorView.id, {
      title: '500',
      description: 'Мы уже фиксим...',
    })
  }
}
