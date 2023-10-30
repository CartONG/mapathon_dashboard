<template>
  <div>
    <Loader :message="loadingMessage" />
    <ErrorDisplay :message="errorMessage" />
    <div v-if="projectLoaded">
      <ProjectHeader />
      <ProjectData />
      <ProjectLeaderboard />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import ErrorDisplay from "./ErrorDisplay.vue";
import Loader from "./Loader.vue";
import ProjectData from "./ProjectData.vue";
import ProjectHeader from "./ProjectHeader.vue";
import ProjectLeaderboard from "./ProjectLeaderboard.vue";

import { store } from "@/store";

@Component({
  components: {
    ErrorDisplay,
    Loader,
    ProjectData,
    ProjectHeader,
    ProjectLeaderboard,
  },
})
export default class Project extends Vue {
  private currentState = store.state;

  get errorMessage() {
    return this.currentState.errorMessage;
  }

  get loadingMessage() {
    return this.currentState.loadingMessage;
  }

  get projectLoaded() {
    return this.currentState.projectLoaded;
  }
}
</script>
