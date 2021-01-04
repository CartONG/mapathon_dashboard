<template>
  <div class="loader-container" v-if="message">
    <p>{{ message }}</p>
    <div class="loader-container__ring"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop(String) readonly message!: string;
}
</script>

<style lang="scss">
.loader-container {
  text-align: center;
}

/* RING LOADER */
.loader-container__ring {
  display: inline-block;
  width: 80px;
  height: 80px;
  margin-bottom: 30px;
}
.loader-container__ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: rgba(9, 122, 156, 0.829) transparent rgba(9, 122, 156, 0.829)
    transparent;
  animation: loader-container__ring 1.5s linear infinite;
}
@keyframes loader-container__ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
