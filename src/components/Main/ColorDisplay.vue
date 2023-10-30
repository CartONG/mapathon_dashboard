<template>
  <span
    class="color-display"
    v-bind:style="{ 'background-color': backgroundColor }"
  ></span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ColorDisplay extends Vue {
  @Prop(String) readonly backgroundColor!: string;
}
</script>

<style lang="scss">
.color-display {
  height: 15px;
  width: 15px;
  border-width: 2px;
  border-style: solid;
  display: inline-block;
}
</style>
