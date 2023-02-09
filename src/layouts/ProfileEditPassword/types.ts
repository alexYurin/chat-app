import { Form, Button, Link } from 'components/index'
import { FormProps } from 'components/Form'

export type ProfileEditPasswordAvatarFieldNameType = string
export type ProfileEditPasswordAvatarSrcType = string
export type ProfileEditPasswordAvatarAltType = string
export type ProfileEditPasswordFormType = Form
export type ProfileEditPasswordSubmitType = Button
export type ProfileEditPasswordBackLinkType = Link

export type ProfileEditPasswordChildrenPropsType = [
  ProfileEditPasswordAvatarFieldNameType,
  ProfileEditPasswordAvatarSrcType,
  ProfileEditPasswordAvatarAltType,
  ProfileEditPasswordFormType,
  ProfileEditPasswordSubmitType,
  ProfileEditPasswordBackLinkType
]

export interface ProfileEditPasswordPropsType {
  fields: FormProps['fields']
  avatar: {
    src: string
    fieldName: string
    alt: string
  }
  children?: ProfileEditPasswordChildrenPropsType
}
