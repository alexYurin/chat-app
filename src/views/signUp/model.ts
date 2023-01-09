import { Link } from 'components/index'
import { BaseModelType } from 'views/ViewModel'

export type SignUpModelType = BaseModelType

const createModel = ({ title }: SignUpModelType) => ({
  title,
  backLink: new Link().create({
    href: '/',
    slot: 'Back',
  }),
})

export default createModel
