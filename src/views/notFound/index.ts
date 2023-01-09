import view from 'bundle-text:./view.pug'
import model from './model'
import Route from 'router/Route'
import './styles.scss'

new Route(view, model)
