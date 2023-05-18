import { BaseComponentProps } from 'components/Base'
import {
  ChatContactsList,
  ChatCreateForm,
  ChatRemoveForm,
  ChatProfileForm,
  ChatMessagesList,
  ChatMessageInput,
  ChatUsersGroup,
  ChatUsersForm,
} from './components'
import { Avatar, Loader } from 'components/index'
import { FormProps } from 'components/Form'
import { InputProps } from 'components/Input'
import { AvatarProps } from 'components/Avatar'

export type ChatProfileAvatarType = Avatar
export type ChatMessagesListLoaderType = Loader
export type ChatContactsListType = ChatContactsList
export type ChatChatUsersGroupType = ChatUsersGroup
export type ChatCreateFormType = ChatCreateForm
export type ChatRemoveFormType = ChatRemoveForm
export type ChatUsersFormType = ChatUsersForm
export type ChatProfileFormType = ChatProfileForm
export type ChatMessagesListType = ChatMessagesList
export type ChatMessageInputType = ChatMessageInput

export type ChatChildrenPropsType = [
  ChatProfileAvatarType,
  ChatMessagesListLoaderType,
  ChatCreateFormType,
  ChatRemoveFormType,
  ChatUsersFormType,
  ChatContactsListType,
  ChatChatUsersGroupType,
  ChatProfileFormType,
  ChatMessagesListType,
  ChatMessageInputType
]

export interface ChatPropsType extends BaseComponentProps {
  isLoadingContacts?: boolean
  isLoadingCreateChatForm?: boolean
  isLoadingRemoveChatForm?: boolean
  isLoadingUsersChatForm?: boolean
  isLoadingProfile?: boolean
  isLoadingMessagesList?: boolean
  isVisibleMessageInput?: boolean
  isVisibleContacts?: boolean
  avatar: AvatarProps
  avatarInput: InputProps
  profileFields: FormProps['fields']
  passwordFields: FormProps['fields']
  messageFields: FormProps['fields']
  children?: ChatChildrenPropsType
}
