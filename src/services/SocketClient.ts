export type SocketEventNameType = 'open' | 'close' | 'message' | 'error'

export type SocketEventType = {
  wasClean?: boolean
  code?: number
  reason?: string
  message?: string
  data?: string
  type?: string
}

export type SocketEventCallbackType = (event: SocketEventType) => void

export type SocketCreateParamsType = {
  userId: number
  chatId: number
  token: string
}

export const BASE_SOCKET_HOST = 'wss://ya-praktikum.tech/ws/chats'

export default class SocketClient {
  private socket: WebSocket

  constructor(params: SocketCreateParamsType) {
    this.socket = new WebSocket(
      `${BASE_SOCKET_HOST}/${params.userId}/${params.chatId}/${params.token}`
    )

    return this
  }

  public sendMessage(message: string) {
    this.socket.send(
      JSON.stringify({
        content: message,
        type: 'message',
      })
    )
  }

  public getHistory(offset: number) {
    this.socket.send(
      JSON.stringify({
        content: `${offset}`,
        type: 'get old',
      })
    )
  }

  public close(reason = '') {
    this.socket.close(1000, reason)
  }

  public ping() {
    this.socket.send(
      JSON.stringify({
        type: 'ping',
      })
    )
  }

  public on(eventName: SocketEventNameType, callback: SocketEventCallbackType) {
    this.socket.addEventListener(eventName, callback as EventListener)
  }
}
