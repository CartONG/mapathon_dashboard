<template>
  <div>
    <div class="task-loading" v-if="loadingMessage">
      <p>{{ loadingMessage }}</p>
      <div class="loader-ring"></div>
    </div>
    <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    <div v-if="projectLoaded">
      <ProjectHeader />
      <ProjectData />
      <ProjectLeaderboard />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import ProjectData from './ProjectData.vue'
import ProjectHeader from './ProjectHeader.vue'
import ProjectLeaderboard from './ProjectLeaderboard.vue'

import { store } from './../../store'

@Component({
  components:
  {
    ProjectData,
    ProjectHeader,
    ProjectLeaderboard
  }
})
export default class extends Vue {
  private currentState = store.state;

  get errorMessage()
  {
    return this.currentState.errorMessage;
  }

  get loadingMessage()
  {
    return this.currentState.loadingMessage;
  }

  get projectLoaded()
  {
    return this.currentState.projectLoaded;
  }
}
</script>