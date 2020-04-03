<template>
  <div class="task-box">
    <div>
      <h2>
        <a :href=projectUrl target="_blank">
          <span class="task-id-head">#{{ projectId }}</span>
        </a>
        {{ projectName }}
      </h2>
    </div>
    <div class="task-grid">
      <div class="two-columns-task-info task-info">
        <p class="task-info-key">
          Done
        </p>
        <progress id="task-progress-done" :value=percentMapped max=100>{{ percentMapped }}</progress>
        {{ percentMapped }}%
      </div>
      <div class="two-columns-task-info task-info">
        <p class="task-info-key">
          Validated
        </p>
        <progress id="task-progress-done" :value=percentValidated max=100>{{ percentValidated }}</progress>
        {{ percentValidated }}%
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { store } from '../../store'

@Component
export default class extends Vue {
  private currentState = store.state;

  get projectId()
  {
    return this.currentState.projectId;  
  }

  get projectName()
  {
    return this.currentState.projectName;
  }

  get percentMapped()
  {
    return this.currentState.percentMapped;
  }

  get percentValidated()
  {
    return this.currentState.percentValidated;
  }

  get projectUrl(): string
  {
    return store.constants.HOTOSM_PROJECT_URL + this.currentState.projectId;
  }
}
</script>