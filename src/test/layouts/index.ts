import BaseLayout from 'layouts/Base'
import { BaseComponentProps } from 'components/Base'

const layout = (locals: Record<string, any>) => `.test-layout(id=${locals.id})`

class TestAuthLayout extends BaseLayout<BaseComponentProps> {
  protected template = layout

  protected init() {
    this.props.children = ['Auth']
  }
}

class TestChatLayout extends BaseLayout<BaseComponentProps> {
  protected template = layout

  protected init() {
    this.props.children = ['Chat']
  }
}

export { TestAuthLayout, TestChatLayout }
