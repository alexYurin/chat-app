import { Link } from 'components/index'
import { BaseModelType } from 'views/ViewModel'

export type ErrorModelType = BaseModelType

const createModel = ({ title }: ErrorModelType) => ({
  title,
  backLink: new Link().create({
    href: '/',
    slot: 'Back',
  }),
})

export default createModel
