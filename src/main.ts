import "core-js/stable"
import "regenerator-runtime/runtime"

import "./string.extension"

import App from './App.vue'
import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSun,faMoon);

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  el: '#app',
  render: h => h(App)
});