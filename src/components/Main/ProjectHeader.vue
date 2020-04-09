<template>
  <div class="project-header-container">
    <div>
      <h2 class="project-header-container__title">
        <a :href=projectUrl target="_blank">
          <span class="project-header-container__title-link">#{{ projectId }}</span>
        </a>
        {{ projectName }}
      </h2>
    </div>
    <div class="project-header-percentages-container">
      <div class="project-header-percentages-container__percentage">
        <p class="project-header-percentages-container__percentage-text">
          Done
        </p>
        <progress class="project-header-percentages-container__percentage-progress" :value=percentMapped max=100>{{ percentMapped }}</progress>
        {{ percentMapped }}%
      </div>
      <div class="project-header-percentages-container__percentage">
        <p class="project-header-percentages-container__percentage-text">
          Validated
        </p>
        <progress class="project-header-percentages-container__percentage-progress" :value=percentValidated max=100>{{ percentValidated }}</progress>
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