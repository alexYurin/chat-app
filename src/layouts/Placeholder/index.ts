import layout from 'bundle-text:./layout.pug'
import BaseLayout from 'layouts/Base/index'
import { Title, Link, BaseComponent } from 'components/index'
import { store } from 'services/index'
import { connect } from 'services/Store'
import { Router, routes } from 'router/index'
import { PlaceholderPropsType } from './types'

import './styles.scss'

class PlaceholderLayout extends BaseLayout<PlaceholderPropsType> {
  protected template = layout

  private setRouteBack(event: Event) {
    const { error } = store.getState()

    event.preventDefault()

    if (error) {
      store.set('error', null)
    }

    Router.navigate(routes.signIn.pathname)
  }

  init() {
    const { title, description, error } = this.props

    const titleText = error?.status || title
    const descriptionText = error?.message || description

    this.props.children = [
      new Title({
        level: 1,
        children: [titleText as string],
      }),
      descriptionText,
      new Link({
        href: '#',
        children: ['Назад'],
        listeners: [
          {
            eventType: 'click',
            callback: this.setRouteBack,
          },
        ],
      }),
    ]
  }
}

const withError = connect((state) => ({
  error: state.error,
}))

export default withError<PlaceholderPropsType>(
  PlaceholderLayout as typeof BaseComponent
)
