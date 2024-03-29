import BaseComponent, { BaseComponentProps } from 'components/Base'
import EventBus from 'services/EventBus'
import { UserType } from 'types/user'
import { ChatContactRoomType, ChatMessageType } from 'types/chat'
import { isEquals } from 'utils/index'

export type StateType = {
  isLoading?: boolean
  user?: UserType | null
  currentContact?: ChatContactRoomType | null
  contacts?: ChatContactRoomType[]
  messages?: ChatMessageType[]
  error?: {
    status: number | string
    message: string
  } | null
}

export const STORE_EVENT = {
  UPDATE: '@store:UPDATE',
} as const

export type StoreEventType = (typeof STORE_EVENT)[keyof typeof STORE_EVENT]

class Store extends EventBus<StoreEventType> {
  private state: StateType

  constructor() {
    super()

    this.state = {
      isLoading: false,
      currentContact: null,
      contacts: [],
      messages: [],
      user: null,
      error: null,
    }
  }

  public set<TValue extends StateType[keyof StateType]>(
    key: keyof StateType,
    value: TValue
  ) {
    const state = this.state as Record<string, TValue>

    state[key] = value

    this.emit(STORE_EVENT.UPDATE)
  }

  public getState() {
    return this.state
  }
}

const store = new Store()

export function connect(mapStateToProps: (state: StateType) => StateType) {
  return function <TPropsType extends BaseComponentProps>(
    Component: typeof BaseComponent
  ) {
    return class extends Component<TPropsType> {
      constructor(name: string, props: TPropsType) {
        let state = mapStateToProps(store.getState())

        super(name, { ...props, ...state })

        store.on(STORE_EVENT.UPDATE, () => {
          const newState = mapStateToProps(store.getState())

          if (!isEquals(state, newState)) {
            this.setProps(newState as TPropsType)
          }

          state = newState
        })
      }
    }
  }
}

export default store
