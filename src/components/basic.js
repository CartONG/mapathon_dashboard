'use strict';

import h from 'snabbdom/h';

function selector(tag, id, classes) {
  return tag + (id ? '#' + id : '') + (classes ? '.' + classes.join('.') : '');
}

function attributes() {
  return Array.from(arguments).reduce((acc, curr) => {
    if(curr.value) {
      acc[curr.attr] = curr.value;
    }
    return acc;
  }, {});
}

function events() {
  return Array.from(arguments).reduce((acc, curr) => {
    if(curr.func) {
      acc[curr.event] = curr.func;
    }
    return acc;
  }, {});
}

export function a(model) {
  const href = model.href || '#';
  const sel = selector('a', model.id, model.classes);
  const attrs = attributes({
    attr: 'href',
    value: href
  },{
    attr: 'target',
    value: model.target
  });
  
  return h(sel, { attrs: attrs }, model.children);
}

export function img(model) {
  const sel = selector('img', model.id, model.classes);
  const attrs = attributes({
    attr: 'src',
    value: model.src
  },{
    attr: 'alt',
    value: model.alt
  });
  
  return h(sel, { attrs: attrs }, model.children);
}

function label(model) {
  const sel = selector('label');
  const attrs = attributes({
    attr: 'for',
    value: model.for
  });

  return h(sel, { attrs: attrs }, model.text);
}

export function input(model) {
  const sel = selector('input', model.id, model.classes);
  const attrs = attributes({
    attr: 'type',
    value: model.type
  },{
    attr: 'name',
    value: model.name
  }, {
    attr: 'value',
    value: model.value    
  });

  if(model.label === '') {
    return h(sel, { attrs: attrs });    
  }

  return h('div', [
    label({ for: model.id, text: model.label }),
    h(sel, { attrs: attrs })
  ]);
}

export function option(model) {
  const sel = selector('option', model.id, model.classes);
  const attrs = attributes({
    attr: 'value',
    value: model.value
  });
  return h(sel, attrs, model.text);   
}

export function select(model) {
  const sel = selector('select', model.id, model.classes);
  return h(sel, model.children);  
}

export function form(model) {
  const sel = selector('form', model.id, model.classes);
  const evs = events({
    event: 'submit',
    func: model.onsubmit
  })

  if(model.submit) {
    const submit = input({
      type: 'submit',
      value: model.submitText || 'Submit'
    });
    model.children.push(submit);
  }

  return h(sel, { on: evs }, model.children);
}