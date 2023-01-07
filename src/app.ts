import 'components/index'
import 'styles/index.scss'

const button = window.components.button.create({
  slot: 'Button',
  status: 'primary',
  className: 'test-button',
})

window.addEventListener('load', () => {
  document.body.insertAdjacentHTML('beforeend', button)
})
