import { AuthDataType } from './Auth'
import { PagesDataType } from './Pages'
import { PlaceholderDataType } from './Placeholder'
import { ProfileDataType } from './Profile'
import { ProfileEditPasswordDataType } from './ProfileEditPassword'
import { ChatDataType } from './Chat'

export type LayoutDataType =
  | AuthDataType
  | PagesDataType
  | PlaceholderDataType
  | ProfileDataType
  | ProfileEditPasswordDataType
  | ChatDataType

export { default as BaseLayout } from './Base'
export { default as PlaceholderLayout } from './Placeholder'
export { default as AuthLayout } from './Auth'
export { default as ProfileLayout } from './Profile'
export { default as ProfileEditPasswordLayout } from './ProfileEditPassword'
export { default as PagesLayout } from './Pages'
export { default as ChatLayout } from './Chat'
