<template>
  <div class="project-header-container">
    <div>
      <h2 v-if="isNameFound" :class="projectHeaderTitleClasses">
        <a :href="projectUrl" target="_blank">
          <span class="project-header-container__title-link"
            >#{{ projectId }}</span
          >
        </a>
        {{ projectName }}
      </h2>
      <Loader v-else :message="'Waiting for name'" />
    </div>
    <div class="project-header-percentages-container">
      <PercentageDisplay :message="'Done'" :percentage="percentMapped" />
      <PercentageDisplay
        :message="'Validated'"
        :percentage="percentValidated"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Loader from "./Loader.vue";
import PercentageDisplay from "./PercentageDisplay.vue";

import { store } from "../../store";

@Component({
  components: {
    Loader,
    PercentageDisplay
  }
})
export default class extends Vue {
  private currentState = store.state;

  get projectHeaderTitleClasses(): string {
    return (
      "project-header-container__title" +
      (this.currentState.isThemeDark
        ? " project-header-container__title--dark-theme"
        : "")
    );
  }

  get isNameFound() {
    console.log(this.projectName);
    return this.projectName.length != 0;
  }

  get projectId() {
    return this.currentState.projectId;
  }

  get projectName() {
    return this.currentState.projectName;
  }

  get percentMapped() {
    return this.currentState.percentMapped;
  }

  get percentValidated() {
    return this.currentState.percentValidated;
  }

  get projectUrl(): string {
    return (
      store.constants.TASKING_MANAGER_INFORMATIONS[
        this.currentState.chosenTaskingManager
      ].projectURL + this.currentState.projectId
    );
  }
}
</script>

<style lang="scss">
.project-header-container {
  margin: 0px 16px 16px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.project-header-container__title {
  background-color: #f7f7f7;
  padding: 16px 16px 8px;
  font-size: 26px;
  font-weight: 800;
}

.project-header-container__title-link {
  font-size: 36px;
}

.project-header-percentages-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: baseline;
  padding: 0px 0px 5px 10px;
}

.project-header-container__title--dark-theme {
  background-color: #2c3e47;
}
</style>
