import { Link } from 'components/index'
import { BaseModelType } from 'views/ViewModel'

export type ProfileModelType = BaseModelType

const createModel = ({ title }: ProfileModelType) => ({
  title,
  backLink: new Link().create({
    href: '/',
    slot: 'Back',
  }),
})

export default createModel
