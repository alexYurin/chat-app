import { Link } from 'components/index'
import { BaseModelType } from 'views/ViewModel'

export type SignInModelType = BaseModelType

const createModel = ({ title }: SignInModelType) => ({
  title,
  backLink: new Link().create({
    href: '/',
    slot: 'Back',
  }),
})

export default createModel
