<template>
  <div class="task-sub-section three-columns-task-sub-section box-shadow-data">
    <h4>Map</h4>
    <div id="overview-map">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { store } from '../../store'

@Component
export default class extends Vue {
  mounted()
  {
    store.displayOverviewMap();
  }

  beforeDestroy()
  {
    //Appeler en cliquant sur "Submit"
    store.destroyOverviewMap();
  }
}
</script>