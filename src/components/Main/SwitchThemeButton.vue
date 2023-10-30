<template>
  <div class="switch-theme-button-container">
    <font-awesome-icon class="icon" icon="sun" size="lg" fixed-width />
    <label class="switch">
      <input
        v-model="state.isThemeDark"
        type="checkbox"
        @change="onChange($event)"
      />
      <span class="slider round"></span>
    </label>
    <font-awesome-icon class="icon" icon="moon" size="lg" fixed-width />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { store } from "../../store";

@Component
export default class SwitchThemeButton extends Vue {
  state = store.state;

  onChange() {
    store.updateTheme(this.state.isThemeDark);
  }
}
</script>

<style lang="scss">
.switch-theme-button-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  margin-right: 10px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 25px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 19px;
  width: 20px;
  left: 7px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: rgb(54, 89, 117);
}

input:focus + .slider {
  box-shadow: 0 0 1px rgb(54, 89, 117);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.icon {
  margin: 2.5px;
}
</style>
