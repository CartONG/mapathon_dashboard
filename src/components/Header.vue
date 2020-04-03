<template>
  <header>
    <AnchorImage link="http://www.cartong.org/" id="cartong-logo" 
      imageUrl="./images/CartONG_logo.png" alt="CartONG logo" />
    <h1>Mapathon Dashboard</h1>
    <AnchorImage link="https://github.com/CartONG/mapathon_dashboard/" id="github-logo" 
      imageUrl="./images/GitHub_logo.png" alt="GitHub logo" /> 
    <AnchorImage link="http://www.missingmaps.org" id="mm-logo"
      imageUrl="./images/mm_logo.png" alt="Missing Maps logo" />
    <AnchorImage link="https://www.hotosm.org" id="hot-logo"
      imageUrl="./images/hot_logo.png" alt="HOT logo" />
  </header>
</template>

<script lang="ts">
import {Vue, Component } from 'vue-property-decorator'

import AnchorImage from './Header/AnchorImage.vue'

@Component({
  components:
  {
    AnchorImage
  }
})
export default class extends Vue{}
</script>