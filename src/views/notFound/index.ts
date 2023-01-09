import view from 'bundle-text:./view.pug'
import createModel from './model'
import routes from 'router/routes'
import ViewModel from 'views/ViewModel'
import './styles.scss'

const { pathname, title } = routes.notFound

export default new ViewModel(
  pathname,
  view,
  createModel({
    title,
  })
)
