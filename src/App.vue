<template>
  <div id="app" >
    <Header />
    <Main />
  </div>
</template>

<script lang="ts">
import {Vue, Component } from 'vue-property-decorator'

import Header from './components/Header.vue'
import Main from './components/Main.vue'

@Component({
  components:
  {
    Header,
    Main
  }
})
export default class extends Vue{}
</script>

<style>
  @import './styles/layout.css';
</style>