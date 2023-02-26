import AuthController from 'layouts/Auth/controller'

export default class ChatController {
  public async logout() {
    return await new AuthController().logout()
  }
}
