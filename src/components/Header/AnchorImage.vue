<template>
  <a :href="link" target="_blank">
    <img :id="id" 
      :src="imageUrl" 
      :alt="alt">
  </a>
</template>

<script lang="ts">
import {Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue{
  @Prop() link!: string;
  @Prop() id!: string;
  @Prop() imageUrl!: string;
  @Prop() alt!: string;
}
</script>