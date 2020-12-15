<template>
  <a :href="link" target="_blank">
    <img
      :class="activeClasses"
      :id="id"
      :src="require(`@/assets/images/${currentImageName}`)"
      :alt="alt"
    />
  </a>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import { store } from "./../../store";

@Component
export default class extends Vue {
  @Prop() link!: string;
  @Prop() id!: string;
  @Prop() imageName!: string;
  @Prop() alt!: string;
  currentState = store.state;

  get currentImageName() {
    let currentImageName = this.imageName;
    if (this.currentState.isThemeDark) {
      switch (this.id) {
        case "mm-logo":
        case "github-logo": {
          const logoWordIndex = currentImageName.indexOf("logo") + 4;
          currentImageName =
            currentImageName.substring(0, logoWordIndex) + "_light.png";
          break;
        }
      }
    }
    return currentImageName;
  }

  get activeClasses() {
    return this.id == "cartong-logo"
      ? "header__image header__image-cartong"
      : "header__image";
  }
}
</script>

<style lang="scss">
.header__image {
  max-height: 5rem;
  width: auto;
  margin-right: 1rem;
}

.header__image-cartong {
  margin-top: 1rem;
  max-height: 3rem;
  margin-right: unset;
}
</style>
