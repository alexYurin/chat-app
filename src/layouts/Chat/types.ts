import { BaseComponentProps } from 'components/Base'
import { FormProps } from 'components/Form'
import { InputProps } from 'components/Input'
import { AvatarProps } from 'components/Avatar'

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
}
