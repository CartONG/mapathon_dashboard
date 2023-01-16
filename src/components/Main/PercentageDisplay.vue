<template>
  <div class="project-header-percentages-container__percentage">
    <p class="project-header-percentages-container__percentage-text">
      {{ message }}
    </p>
    <progress
      class="project-header-percentages-container__percentage-progress"
      :value="percentage"
      max="100"
    >
      {{ percentage }}
    </progress>
    {{ percentage }}%
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop(String) readonly message!: string;
  @Prop(Number) readonly percentage!: number;
}
</script>

<style lang="scss">
.project-header-percentages-container__percentage {
  display: flex;
  align-items: baseline;
  width: calc(50% - 32px);
}
.project-header-percentages-container__percentage-text {
  font-size: 16px;
  font-weight: 700;
  margin: initial;
}

.project-header-percentages-container__percentage-progress {
  margin: 0 5px;
}
</style>
