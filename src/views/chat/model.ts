import { Link } from 'components/index'
import { BaseModelType } from 'views/ViewModel'

export type ChatModelType = BaseModelType

const createModel = ({ title }: ChatModelType) => ({
  title,
  backLink: new Link().create({
    href: '/',
    slot: 'Back',
  }),
})

export default createModel
