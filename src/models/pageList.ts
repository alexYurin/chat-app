import { PageController } from 'controllers/index'
import view from 'views/pageList'

const PageListModel = new PageController(view)

const button = window.components.button.create({
  name: 'submit',
  className: 'greeting-btn',
  slot: 'New Button',
})

const link1 = window.components.link.create({
  className: 'greeting-link',
  href: '#',
  slot: 'link 1',
})

const link2 = window.components.link.create({
  className: 'greeting-link',
  href: '#',
  slot: 'link 2',
})

PageListModel.render({
  header: 'YEAH! THIS IS INDEX PAGE!!!',
  links: [link1, link2],
  button,
})
