import { BaseComponentProps } from 'components/Base'
import { Form, Input, Button, Avatar, Image } from 'components/index'
import { FormProps } from 'components/Form'
import { InputProps } from 'components/Input'
import { AvatarProps } from 'components/Avatar'

export type ChatProfileEditAvatarIconType = Image
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
  ChatProfileEditAvatarIconType,
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
  avatar: AvatarProps
  avatarInput: InputProps
  profileFields: FormProps['fields']
  passwordFields: FormProps['fields']
  messageFields: FormProps['fields']
  children?: ChatChildrenPropsType
}
