<template>
  <div>
    <label class="label-input" :for="id">{{ label }}</label>
    <input
      v-bind="$attrs"
      :id="id"
      :type="type"
      v-on="inputListeners"
      :class="activeClasses"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  inheritAttrs: false,
})
export default class BaseInput extends Vue {
  @Prop() id!: string;
  @Prop() label!: string;
  @Prop() type!: string;
  @Prop() isThemeDark!: boolean;

  get activeClasses(): string {
    let classes = this.isThemeDark ? "input--dark-theme " : "";
    classes += this.type == "text" ? "input-date" : "input-project-id";
    return classes;
  }
  // eslint-disable-next-line
  get inputListeners(): Record<string, Function | Function[]> {
    // `Object.assign` merges objects together to form a new object
    return Object.assign(
      {},
      // We add all the listeners from the parent
      this.$listeners,
      // Then we can add custom listeners or override the
      // behavior of some listeners.
      {
        // This ensures that the component works with v-model
        input: (event: Event) => this.$emit("input", event),
      }
    );
  }
}
</script>

<style lang="scss">
.label-input {
  margin-bottom: 0;
  margin-right: 5px;
}

.input-date {
  max-width: 150px;
}

.input-project-id {
  max-width: 100px;
}

.input-submit {
  margin-left: 30px;
}

.input--dark-theme {
  background-color: #182b36 !important;
}

.input-submit--dark-theme {
  color: white !important;
}
</style>
