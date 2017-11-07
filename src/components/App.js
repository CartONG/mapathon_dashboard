'use strict';

import h from 'snabbdom/h';
import Navbar from './Navbar';
import ParamsForm from './ParamsForm';

function view(model, handler) {
  
  console.log(model);

  return h('div#app', [
    Navbar.view(model, handler),
    ParamsForm.view(model, handler)
  ]); 
}

export default { view }