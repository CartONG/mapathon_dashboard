<template>
  <p class="error-message" v-if="message">{{ message }}</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ErrorDisplay extends Vue {
  @Prop(String) readonly message!: string;
}
//TODO meilleur handler
</script>

<style lang="scss">
.error-message {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: red;
}
</style>
