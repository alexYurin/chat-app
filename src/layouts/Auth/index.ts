import layout from './layout.pug'
import BaseLayout from 'layouts/Base/index'
import AuthController from './controller'
import { connect } from 'services/Store'
import {
  Title,
  Form,
  Loader,
  Button,
  Link,
  BaseComponent,
} from 'components/index'
import {
  AuthSignInRequestParamsType,
  AuthSignUpRequestParamsType,
} from 'api/Auth'
import { InputProps } from 'components/Input'
import { LoaderProps } from 'components/Loader'
import { AuthPropsType } from './types'

import './styles.scss'

export type FormValuesType =
  | AuthSignInRequestParamsType
  | AuthSignUpRequestParamsType

const formId = 'auth-form'

class AuthLayout extends BaseLayout<AuthPropsType> {
  protected template = layout
  protected disableRenderPropsList = ['isLoading']
  protected controller = new AuthController()

  protected onUpdateProps(
    propKey: keyof AuthPropsType,
    prevValue: unknown,
    newValue: unknown
  ): boolean {
    if (this.disableRenderPropsList.includes(propKey)) {
      switch (propKey) {
        case 'isLoading': {
          const isVisible = newValue as boolean
          const loader = document.querySelector(
            '.auth-layout__loader'
          ) as HTMLElement

          const loaderComponent = BaseLayout.findChild<Loader>(
            loader,
            this.props.children
          )

          loaderComponent?.setProps<LoaderProps>({
            isVisible,
          })

          break
        }

        default:
          console.log(
            `Unhandled prop "${propKey}" in skip re-render with values: ${prevValue}, ${newValue}`
          )

          break
      }
    }

    return false
  }

  private validate(event: Event, currentInputProps: InputProps) {
    Form.validate(event, currentInputProps, this.props.children)
  }

  private onSubmit(event: Event) {
    const { isValidForm, values } = Form.preSubmitValidate<FormValuesType>(
      event,
      this.props.children
    )

    if (isValidForm) {
      this.controller.setAuth(values)
    }
  }

  protected init() {
    const { isLoading, title, authLink, fields, submitButtonText } = this.props

    this.props.children = [
      new Loader({
        className: 'auth-layout__loader',
        isVisible: isLoading,
        withOverlay: true,
      }),
      new Title({
        className: 'auth-layout__title',
        level: 1,
        children: [title],
      }),
      new Form({
        id: formId,
        className: 'auth-layout__form scroll',
        fields: fields.map(({ label, input }) => {
          input.listeners = [
            {
              eventType: 'blur',
              callback: (event: Event) => this.validate(event, input),
            },
          ]

          return {
            label,
            input,
          }
        }),
        listeners: [
          {
            eventType: 'submit',
            callback: this.onSubmit.bind(this),
          },
        ],
      }),
      new Button({
        status: 'primary',
        type: 'submit',
        form: formId,
        children: [submitButtonText],
      }),
      new Link(authLink),
    ]
  }
}

const withState = connect((state) => ({
  user: state.user,
  isLoading: state.isLoading,
}))

export default withState<AuthPropsType>(AuthLayout as typeof BaseComponent)
