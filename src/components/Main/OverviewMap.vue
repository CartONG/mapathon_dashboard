<template>
  <div class="project-overview-map">
    <h4 class="project-overview-map__title">Map</h4>
    <div id="overview-map"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { store } from "../../store";

@Component
export default class extends Vue {
  mounted() {
    store.displayOverviewMap();
  }

  beforeDestroy() {
    //Appeler en cliquant sur "Submit"
    store.destroyOverviewMap();
  }
}
</script>

<style lang="scss">
.project-overview-map {
  flex: 1 0 calc(33.3% - 96px);
  margin: 16px;
  padding: 16px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.project-overview-map__title {
  font-size: 22px;
  padding: 0 0 8px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid rgb(0, 188, 212);
}

#overview-map {
  width: 100%;
  height: 300px;
}
</style>
