import { JSDOM } from 'jsdom'

process.env.HTML_TEMPLATOR = 'pug'

const DOM = new JSDOM(
  '<html>' +
    '<head></head>' +
    '<body>' +
    '<main id="root" class="root"></main>' +
    '</body>' +
    '</html>',
  {
    url: 'http://localhost',
  }
)

global.window = DOM.window as unknown as Window & typeof globalThis
global.history = DOM.window.History as unknown as History
global.document = DOM.window.document

export default DOM
