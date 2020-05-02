<template>
  <div id="app">
    <Header />
    <Main />
  </div>
</template>

<script lang="ts">
import {Vue, Component } from 'vue-property-decorator'

import Header from './components/Header.vue'
import Main from './components/Main.vue'

import { store } from './store'

@Component({
  components:
  {
    Header,
    Main
  }
})
export default class extends Vue {
  mounted ()
  {
    store.initializeTheme();
  }
}
</script>

<style>
.body-container--dark-theme {
  background-color: #182b36;
  color:white;
}
</style>