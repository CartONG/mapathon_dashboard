/* eslint-env browser */
/* global componentHandler */

'use strict';

window.addEventListener('load', function() {
  getmdlSelect.init('.getmdl-select'); // eslint-disable-line no-use-before-define
  document.addEventListener('DOMNodeInserted', function(ev) {
    if (ev.relatedNode.querySelectorAll('.getmdl-select').length > 0) {
      componentHandler.upgradeDom();
    }
  }, false);
});

var getmdlSelect = {
  defaultValue: {
    width: 300
  },
  addEventListeners: function(dropdown) {
    var input = dropdown.querySelector('input');
    var list = dropdown.querySelectorAll('li');
    var menu = dropdown.querySelector('.mdl-js-menu');

    // show menu on mouse down or mouse up
    input.onkeydown = function(event) {
      if (event.keyCode === 38 || event.keyCode === 40) {
        menu['MaterialMenu'].show(); // eslint-disable-line dot-notation
      }
    };

    // return focus to input
    menu.onkeydown = function(event) {
      if (event.keyCode === 13) {
        input.focus();
      }
    };

    [].forEach.call(list, function(li) {
      li.onclick = function() {
        input.value = li.textContent;
        // handles css class changes
        dropdown.MaterialTextfield.change(li.textContent);
        setTimeout(function() {
          // update css class
          dropdown.MaterialTextfield.updateClasses_();
        }, 250);

        // update input with the 'id' value
        input.dataset.val = li.dataset.val || '';

        if ('createEvent' in document) {
          var evt = document.createEvent('HTMLEvents');
          evt.initEvent('change', false, true);
          input.dispatchEvent(evt);
        } else {
          input.fireEvent('onchange');
        }
      };
    });
  },
  init: function(selector) {
    var dropdowns = document.querySelectorAll(selector);
    [].forEach.call(dropdowns, function(i) {
      getmdlSelect.addEventListeners(i);
    });
  }
};
