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
import { Component, Vue } from "vue-property-decorator";

import ProjectData from "./ProjectData.vue";
import ProjectHeader from "./ProjectHeader.vue";
import ProjectLeaderboard from "./ProjectLeaderboard.vue";

import { store } from "./../../store";

@Component({
  components: {
    ProjectData,
    ProjectHeader,
    ProjectLeaderboard
  }
})
export default class extends Vue {
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

<style lang="scss">
.task-loading {
  text-align: center;
}

/* RING LOADER */
.loader-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
  margin-bottom: 30px;
}
.loader-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: rgba(9, 122, 156, 0.829) transparent rgba(9, 122, 156, 0.829)
    transparent;
  animation: loader-ring 1.5s linear infinite;
}
@keyframes loader-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* ERROR */
.error-message {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: red;
}
</style>
