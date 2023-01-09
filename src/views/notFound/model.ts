import { Link } from 'components/index'
import { BaseModelType } from 'views/ViewModel'

export type NotFoundModelType = BaseModelType

const createModel = ({ title }: NotFoundModelType) => ({
  title,
  backLink: new Link().create({
    href: '/',
    slot: 'Back',
  }),
})

export default createModel
