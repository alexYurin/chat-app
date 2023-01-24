import layout from 'bundle-text:./layout.pug'
import ProfileEditModel, { ProfileEditModelProps } from './model'
import { BaseController } from 'core/index'

export default class ProfileEditLayout extends BaseController {
  protected template = layout

  constructor(name: string, props: ProfileEditModelProps) {
    super(
      name,
      {
        pathname: props.pathname,
        screenTitle: props.screenTitle,
      },
      {
        onMount: () => {
          console.log(`Mounted Layout: ${name}`)
        },
        onUpdate: (props) => {
          console.log(`Updated props Layout: ${name}, ${props}`)
        },
      }
    )

    this.modelInstance = new ProfileEditModel(props)
  }
}
