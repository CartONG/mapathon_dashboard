import "core-js/stable"
import "regenerator-runtime/runtime"

import "./string.extension"

import App from './App.vue'
import Vue from 'vue'

new Vue({
  el: '#app',
  render: h => h(App)
});