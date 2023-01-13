import { Title, Link } from 'components/index'
import { BaseModelType } from 'layouts/LayoutModel'

export interface PlaceholderModelType extends BaseModelType {
  description: string
}

const modelConstructor = ({ title, description }: PlaceholderModelType) => ({
  title: new Title().create({
    level: 1,
    slot: title,
  }),
  description,
  backLink: new Link().create({
    href: '/',
    slot: 'К списку страниц',
  }),
})

export type PlaceholderModelConstructorType = ReturnType<
  typeof modelConstructor
>

export default modelConstructor
