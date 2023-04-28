import { BaseComponentProps } from 'components/Base'
import {
  ChatContactList,
  ChatCreateForm,
  ChatRemoveForm,
  ChatProfileForm,
  ChatMessageInput,
} from './components'
import { Avatar } from 'components/index'
import { FormProps } from 'components/Form'
import { InputProps } from 'components/Input'
import { AvatarProps } from 'components/Avatar'

export type ChatProfileAvatarType = Avatar
export type ChatContactListType = ChatContactList
export type ChatCreateFormType = ChatCreateForm
export type ChatRemoveFormType = ChatRemoveForm
export type ChatProfileFormType = ChatProfileForm
export type ChatMessageInputType = ChatMessageInput

export type ChatChildrenPropsType = [
  ChatProfileAvatarType,
  ChatCreateFormType,
  ChatRemoveFormType,
  ChatContactListType,
  ChatProfileFormType,
  ChatMessageInputType
]

export interface ChatPropsType extends BaseComponentProps {
  isLoadingContacts?: boolean
  isLoadingCreateChatForm?: boolean
  isLoadingRemoveChatForm?: boolean
  isLoadingProfile?: boolean
  isVisibleMessageInput?: boolean
  isVisibleContacts?: boolean
  avatar: AvatarProps
  avatarInput: InputProps
  profileFields: FormProps['fields']
  passwordFields: FormProps['fields']
  messageFields: FormProps['fields']
  children?: ChatChildrenPropsType
}
