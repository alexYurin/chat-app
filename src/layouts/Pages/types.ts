import { BaseComponentProps } from 'components/Base'
import { Title, Link } from 'components/index'

export type PagesChildrenPropsType = [Title, ...Link[]]

export interface PagesPropsType extends BaseComponentProps {
  title: string
  children?: PagesChildrenPropsType
}
