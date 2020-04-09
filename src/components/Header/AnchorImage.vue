<template>
  <a :href="link" target="_blank">
    <img :class="activeClasses" :id="id" 
      :src="imageUrl" 
      :alt="alt">
  </a>
</template>

<script lang="ts">
import {Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop() link!: string;
  @Prop() id!: string;
  @Prop() imageUrl!: string;
  @Prop() alt!: string;

  get activeClasses()
  {
    return this.id=="cartong-logo"?"header__image header__image-cartong":"header__image";
  }
}
</script>