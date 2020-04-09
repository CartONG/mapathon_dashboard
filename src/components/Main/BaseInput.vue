<template>
  <div>
    <label class="label-input" :for="id">{{label}}</label>
    <input v-bind="$attrs" :id="id" :type="type" v-on="inputListeners" :class="activeClasses" >
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
    inheritAttrs: false
})
export default class extends Vue {
  @Prop() id!: string;
  @Prop() label!: string;
  @Prop() type!: string;

  get activeClasses(): string
  {
    return this.type=="text"?"input-date":"input-project-id";
  }
  get inputListeners(): Object {
      var vm = this
      // `Object.assign` merges objects together to form a new object
      return Object.assign({},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          // This ensures that the component works with v-model
          input: function (event: Event) {
            vm.$emit('input', event)
          }
        }
      )
    }
}
</script>