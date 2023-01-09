import view from 'bundle-text:./view.pug'
import createModel from './model'
import ViewModel from 'views/ViewModel'
import routes from 'router/routes'
import './styles.scss'

const { pathname, title } = routes.chat

export default new ViewModel(
  pathname,
  view,
  createModel({
    title,
  })
)
