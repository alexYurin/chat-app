import { BaseComponentProps } from 'components/Base'
import { Title, Link } from 'components/index'

export type PlaceholderTitleType = Title
export type PlaceholderDescriptionType = string
export type PlaceholderBackLinkType = Link

export type PlaceholderChildrenPropsType = [
  PlaceholderTitleType,
  PlaceholderDescriptionType,
  PlaceholderBackLinkType
]

export interface PlaceholderPropsType extends BaseComponentProps {
  title: string
  description: string
  children?: PlaceholderChildrenPropsType
}
