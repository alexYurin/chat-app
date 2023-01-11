import { Title, Link } from 'components/index'
import { BaseModelType } from 'views/ViewModel'

export interface PlaceholderModelType extends BaseModelType {
  description: string
  linkUrl: string
  linkText: string
}

const createModel = ({
  title,
  description,
  linkUrl,
  linkText,
}: PlaceholderModelType) => ({
  title: new Title().create({
    level: 1,
    slot: title,
  }),
  description,
  backLink: new Link().create({
    href: linkUrl,
    slot: linkText,
  }),
})

export default createModel
