import AbstractRenderer from './AbstractRenderer'
import PugRenderer from './PugRenderer'

export type RendererType = 'pug'

const DEFAULT_RENDERER = process.env.HTML_RENDERER as RendererType

const createRenderer = (
  renderer: RendererType
): AbstractRenderer | undefined => {
  switch (renderer) {
    case 'pug':
      return new PugRenderer({
        pretty: true,
      })

    default:
      throw new Error(`Unknown renderer: ${renderer}`)
  }
}

export default createRenderer(DEFAULT_RENDERER)
