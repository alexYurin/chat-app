import { Title, Link } from 'components/index'
import { BaseControllerProps } from 'core/BaseController'
import BaseModel from 'core/BaseModel'

export interface PlaceholderModelType {
  title: Title
  description: string
  backLink: Link
}

export interface PlaceholderModelProps extends BaseControllerProps {
  title: string
  description: string
}

export default class PlaceholderModel extends BaseModel<
  PlaceholderModelProps,
  PlaceholderModelType
> {
  constructor(props: PlaceholderModelProps) {
    super(props)

    this.configurate()
  }

  configurate() {
    const { title, description } = this.props

    this.model = {
      title: new Title({
        level: 1,
        children: [title],
      }),
      description,
      backLink: new Link({
        href: '/',
        children: ['К списку страниц'],
      }),
    }
  }
}
