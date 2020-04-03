<template>
  <span class="color-display" v-bind:style="{'background-color': backgroundColor}"></span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop(String) readonly backgroundColor!: string;
}
</script>