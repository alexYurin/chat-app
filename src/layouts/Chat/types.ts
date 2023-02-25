import { BaseComponentProps } from 'components/Base'
import { Form, Input, Button, Avatar, Image, Loader } from 'components/index'
import { FormProps } from 'components/Form'
import { InputProps } from 'components/Input'
import { AvatarProps } from 'components/Avatar'

export type ChatProfileLoaderType = Loader
export type ChatProfileEditAvatarIconType = Image
export type ChatProfileLogoutType = Button
export type ChatProfileAvatarSettingsType = Avatar
export type ChatProfileAvatarType = Avatar
export type ChatProfileInputAvatarType = Input
export type ChatProfileFormType = Form
export type ChatPasswordFormType = Form
export type ChatMessageFormType = Form
export type ChatSubmitProfileToggleChangeButtonType = Button
export type ChatSubmitProfileButtonType = Button
export type ChatSubmitPasswordButtonType = Button
export type ChatSubmitMessageButtonType = Button

export type ChatChildrenPropsType = [
  ChatProfileLoaderType,
  ChatProfileEditAvatarIconType,
  ChatProfileLogoutType,
  ChatProfileAvatarSettingsType,
  ChatProfileAvatarType,
  ChatProfileInputAvatarType,
  ChatProfileFormType,
  ChatPasswordFormType,
  ChatMessageFormType,
  ChatSubmitProfileToggleChangeButtonType,
  ChatSubmitProfileButtonType,
  ChatSubmitPasswordButtonType,
  ChatSubmitMessageButtonType
]

export interface ChatPropsType extends BaseComponentProps {
  isLoadingProfile?: boolean
  avatar: AvatarProps
  avatarInput: InputProps
  profileFields: FormProps['fields']
  passwordFields: FormProps['fields']
  messageFields: FormProps['fields']
  children?: ChatChildrenPropsType
}
