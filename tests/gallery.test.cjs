const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync(require('node:path').join(__dirname, '../dist/gallery.js'), 'utf8');
function fixture(supported = true) {
  const make = (extra = {}) => ({
    handlers: {}, addEventListener(type, fn) { this.handlers[type] = fn; },
    removeAttribute(name) { delete this[name]; }, focus() { this.focused = true; },
    replaceChildren(...children) { this.children = children; }, ...extra
  });
  const img = {cloneNode: () => make({alt: 'Tattoo'})};
  const links = [0, 1, 2].map(i => make({dataset: {artworkTitle: `Art ${i}`, ...(i === 1 ? {source:'https://www.instagram.com/p/example/'} : {})}, querySelector: () => img}));
  const ids = Object.fromEntries(['artwork-dialog', 'artwork-view', 'artwork-title', 'artwork-count', 'artwork-source', 'artwork-close', 'artwork-prev', 'artwork-next'].map(id => [id, make()]));
  const dialog = ids['artwork-dialog'];
  if (supported) dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; dialog.handlers.close(); };
  dialog.getBoundingClientRect = () => ({left:10, right:100, top:10, bottom:100});
  vm.runInNewContext(code, {document:{getElementById:id=>ids[id],querySelectorAll:()=>links}});
  const click = (node, extra={}) => node.handlers.click({preventDefault(){},...extra});
  return {ids, links, dialog, click};
}
test('opens, cycles both ways, updates source, closes and restores focus', () => {
  const {ids,links,dialog,click}=fixture();click(links[0]);assert.equal(dialog.open,true);
  assert.equal(ids['artwork-count'].textContent,'1 / 3');assert.equal(ids['artwork-source'].hidden,true);
  click(ids['artwork-next']);assert.equal(ids['artwork-title'].textContent,'Art 1');assert.equal(ids['artwork-source'].hidden,false);
  dialog.handlers.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(ids['artwork-title'].textContent,'Art 2');assert.equal(ids['artwork-source'].href,undefined);
  click(ids['artwork-next']);assert.equal(ids['artwork-count'].textContent,'1 / 3');
  click(ids['artwork-prev']);assert.equal(ids['artwork-count'].textContent,'3 / 3');
  click(ids['artwork-close']);assert.equal(dialog.open,false);assert.equal(links[0].focused,true);assert.equal(ids['artwork-view'].children.length,0);
  click(links[1]);assert.equal(ids['artwork-count'].textContent,'2 / 3');
});
test('only backdrop clicks dismiss, not interior whitespace',()=>{
  const {links,dialog,click}=fixture();click(links[0]);click(dialog,{target:dialog,clientX:50,clientY:50});assert.equal(dialog.open,true);
  click(dialog,{target:dialog,clientX:0,clientY:0});assert.equal(dialog.open,false);
});
test('preserves modified-click and no-dialog image link fallback',()=>{
  const {links,dialog,click}=fixture();click(links[0],{ctrlKey:true});assert.notEqual(dialog.open,true);
  assert.equal(fixture(false).links[0].handlers.click,undefined);
});
