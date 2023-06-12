import { JSDOM } from 'jsdom'

process.env.HTML_TEMPLATOR = 'pug'
process.env.BASE_URL_API = 'https://ya-praktikum.tech/api/v2'

export const DOM = new JSDOM(
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
global.HTMLElement = DOM.window.HTMLElement
global.dispatchEvent = DOM.window.dispatchEvent
global.Event = DOM.window.Event

export default DOM
