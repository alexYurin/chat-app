import BaseLayout from 'layouts/Base'
import { connect } from 'services/Store'
import BaseComponent, { BaseComponentProps } from 'components/Base'

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

class TestPlaceholderLayout extends BaseLayout<BaseComponentProps> {
  protected template = layout

  protected init() {
    this.props.children = ['']
  }
}

const withState = connect((state) => ({ ...state }))

const layouts = {
  TestAuthLayout: withState(TestAuthLayout as typeof BaseComponent),
  TestChatLayout: withState(TestChatLayout as typeof BaseComponent),
  TestPlaceholderLayout: withState(
    TestPlaceholderLayout as typeof BaseComponent
  ),
}

export { layouts }
