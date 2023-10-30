<template>
  <!-- TODO Rajouter l'image pour chaque tasking manager ? -->
  <header class="header">
    <AnchorImage
      link="https://www.cartong.org/"
      id="cartong-logo"
      imageName="CartONG_logo.png"
      alt="CartONG logo"
    />
    <h1 class="header__title">Mapathon Dashboard</h1>
    <AnchorImage
      link="https://www.hotosm.org"
      id="hot-logo"
      imageName="hot_logo.png"
      alt="HOT logo"
    />
    <AnchorImage
      link="https://www.missingmaps.org"
      id="mm-logo"
      imageName="mm_logo.png"
      alt="Missing Maps logo"
    />
    <AnchorImage
      link="https://github.com/CartONG/mapathon_dashboard/"
      id="github-logo"
      imageName="GitHub_logo.png"
      alt="GitHub logo"
    />
  </header>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import AnchorImage from "./Header/AnchorImage.vue";

@Component({
  components: {
    AnchorImage,
  },
})
export default class Header extends Vue {}
</script>

<style lang="scss">
.header {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 1rem;
  border-bottom: 1px solid #f2f2f2;
}

.header__title {
  bottom: 0.3rem;
  font-size: 3rem;
  margin: 0 0 0 1.5rem;
  line-height: inherit;
  width: 80%;
}
</style>
