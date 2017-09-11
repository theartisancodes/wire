import jsdom from 'jsdom';
import { config } from './src/config/index';
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
  url: config.BASE_URL
});
global.document = dom.window.document;
global.window = document.defaultView;
global.navigator = global.window.navigator

const exposedProperties = ['window', 'navigator', 'document'];

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.HTMLElement = window.HTMLElement;

const noop = () => null;

require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.md'] = noop;
require.extensions['.png'] = noop;
require.extensions['.svg'] = noop;
require.extensions['.jpg'] = noop;
require.extensions['.jpeg'] = noop;
require.extensions['.gif'] = noop;