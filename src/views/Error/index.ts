import PlaceholderLayout from 'layouts/Placeholder/index'

export default class ErrorView {
  static pathname = '/error'

  constructor() {
    return new PlaceholderLayout('error', {
      title: '500',
      description: 'Мы уже фиксим...',
    })
  }
}
