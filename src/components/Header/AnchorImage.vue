<template>
  <a :href="link" target="_blank">
    <img :class="activeClasses" :id="id" 
      :src="currentImageUrl" 
      :alt="alt">
  </a>
</template>

<script lang="ts">
import {Vue, Component, Prop } from 'vue-property-decorator'

import { store } from './../../store'

@Component
export default class extends Vue {
  @Prop() link!: string;
  @Prop() id!: string;
  @Prop() imageUrl!: string;
  @Prop() alt!: string;
  currentState = store.state;

  get currentImageUrl()
  {
    let currentImageUrl = this.imageUrl;
    if(this.currentState.isThemeDark)
    {
      switch(this.id)
      {
        case "mm-logo":
        case "github-logo":
          let logoWordIndex = currentImageUrl.indexOf("logo")+4;
          currentImageUrl = currentImageUrl.substring(0,logoWordIndex) + "_light.png";
          break;
      }
    }
    return currentImageUrl;
  }

  get activeClasses()
  {
    return this.id=="cartong-logo"?"header__image header__image-cartong":"header__image";
  }
}
</script>

<style>
.header__image {
  max-height: 5rem;
  width: auto;
  margin-right: 1rem;
}

.header__image-cartong {
  margin-top: 1rem;
  max-height: 3rem;
  margin-right: unset;
}
</style>