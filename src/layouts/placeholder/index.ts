import view from 'bundle-text:./view.pug'
import createModel, { PlaceholderModelType } from './model'
import ViewModel from 'layouts/ViewModel'
import './styles.scss'

export interface PlaceholderLayoutProps extends PlaceholderModelType {
  pathname: string
}

export default class PlaceholderLayout {
  constructor({ pathname, ...modelProps }: PlaceholderLayoutProps) {
    return new ViewModel(pathname, view, createModel(modelProps))
  }
}
