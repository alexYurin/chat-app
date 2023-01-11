import view from 'bundle-text:./view.pug'
import createModel, { AuthModelType } from './model'
import ViewModel from 'layouts/ViewModel'
import './styles.scss'

export interface AuthLayoutProps extends AuthModelType {
  pathname: string
}

export default class AuthLayout {
  constructor({ pathname, ...modelProps }: AuthLayoutProps) {
    return new ViewModel(pathname, view, createModel(modelProps))
  }
}
