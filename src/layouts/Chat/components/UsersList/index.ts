import BaseComponent, { BaseComponentProps } from 'components/Base/index'
import { ChatUserDetail } from 'layouts/Chat/components/index'
import { store } from 'services/index'
import { UserType } from 'types/user'
import { isEquals, isFunction } from 'utils/index'

import templateString from 'bundle-text:./template.pug'
import './styles.scss'

export interface ChatUsersListProps extends BaseComponentProps {
  items?: UserType[]
  onRemoveItem?: (userId: number) => void
}

export const PREFIX_CHAT_ID = 'id_'

export default class ChatUsersList extends BaseComponent<ChatUsersListProps> {
  protected template = templateString
  protected disableRenderPropsList = ['items', 'currentContact']

  constructor(props: ChatUsersListProps) {
    super('chatUsersList', props)

    this.init()

    return this
  }

  protected onUpdateProps(
    propKey: keyof ChatUsersListProps,
    prevProp: unknown,
    newProp: unknown
  ): boolean {
    switch (propKey) {
      case 'items': {
        if (!isEquals(prevProp, newProp)) {
          this.init()

          return true
        }

        return false
      }

      default:
        return false
    }
  }

  private onRemoveItem(userId: number) {
    if (isFunction(this.props.onRemoveItem)) {
      this.props.onRemoveItem(userId)
    }
  }

  protected init() {
    const { items } = this.props
    const user = store.getState().user

    const currentUser = items?.find((userDetail) => userDetail.id === user?.id)
    const itemsWithoutUser = items?.filter(
      (userDetail) => userDetail.id !== user?.id
    )

    const sortedItems =
      currentUser && itemsWithoutUser
        ? [currentUser, ...itemsWithoutUser]
        : items

    if (sortedItems) {
      this.props.children = sortedItems.map((user) => {
        return new ChatUserDetail({
          detail: user,
          onRemove: this.onRemoveItem.bind(this),
        })
      })
    }
  }
}
