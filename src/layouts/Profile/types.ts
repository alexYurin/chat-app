import { BaseComponentProps } from 'components/Base'
import { Form, Button, Link } from 'components/index'
import { FormProps } from 'components/Form'

export type ProfileAvatarFieldNameType = string
export type ProfileAvatarSrcType = string
export type ProfileAvatarAltType = string
export type ProfileFormType = Form
export type ProfileChangeLinkDataType = Link
export type ProfileChangeLinkPasswordType = Link
export type ProfileChangeLinkLogoutType = Link
export type ProfileSubmitType = Button

export type ProfileChildrenPropsType = [
  ProfileAvatarFieldNameType,
  ProfileAvatarSrcType,
  ProfileAvatarAltType,
  ProfileFormType,
  ProfileChangeLinkDataType,
  ProfileChangeLinkPasswordType,
  ProfileChangeLinkLogoutType,
  ProfileSubmitType
]

export interface ProfilePropsType extends BaseComponentProps {
  fields: FormProps['fields']
  avatar: {
    src: string
    fieldName: string
    alt: string
  }
  children?: ProfileChildrenPropsType
}
