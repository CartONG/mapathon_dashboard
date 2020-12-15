<template>
  <div class="project-data-main-container">
    <h2 :class="projectDataTitleClasses">Last update ({{ updateTime }})</h2>
    <div class="project-data-sub-container">
      <OverviewMap />
      <HighwayMap />
      <div class="project-data-built">
        <div class="project-building-data-container">
          <h4 class="project-building-data-container__title">
            Buildings <ColorDisplay :backgroundColor="buildingLayerColor" />
          </h4>
          <BaseInput
            class="project-building-data-container__label-input"
            label="Display buildings on the map"
            name="building"
            type="checkbox"
            v-on:input="valueChanged('building')"
            checked="true"
          />
          <p class="project-building-data-container__paragraph">
            {{ buildingMessage }}
          </p>
        </div>
        <div class="project-landuse-data-container">
          <h4 class="project-landuse-data-container__title">
            Landuse <ColorDisplay :backgroundColor="landuseLayerColor" />
          </h4>
          <BaseInput
            class="project-landuse-data-container__label-input"
            label="Display landuse on the map"
            name="landuse"
            type="checkbox"
            v-on:input="valueChanged('landuse')"
            checked="true"
          />
          <div>
            <b>Residential landuse: </b>
            <span>{{ residentialLanduseArea }} km²</span>
          </div>
          <div>
            <b>Total landuse: </b>
            <span>{{ landuseArea }} km²</span>
          </div>
        </div>
        <div class="project-waterway-data-container">
          <h4 class="project-waterway-data-container__title">
            Waterways <ColorDisplay :backgroundColor="waterwayLayerColor" />
          </h4>
          <BaseInput
            class="project-waterway-data-container__label-input"
            label="Display waterways on the map"
            name="waterway"
            type="checkbox"
            v-on:input="valueChanged('waterway')"
            checked="true"
          />
          <p class="project-waterway-data-container__paragraph">
            {{ waterwayMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import BaseInput from "./BaseInput.vue";
import ColorDisplay from "./ColorDisplay.vue";
import HighwayMap from "./HighwayMap.vue";
import OverviewMap from "./OverviewMap.vue";

import { store } from "./../../store";

import { FeatureName } from "./../../classes/feature-name-interface";

@Component({
  components: {
    BaseInput,
    ColorDisplay,
    HighwayMap,
    OverviewMap
  }
})
export default class extends Vue {
  private currentState = store.state;
  private currentFeaturesInformations = this.currentState.featuresInformations;

  get projectDataTitleClasses(): string {
    return (
      "project-data-main-container__title" +
      (this.currentState.isThemeDark
        ? " project-data-main-container__title--dark-theme"
        : "")
    );
  }

  get updateTime() {
    return this.currentState.updateTime.format(store.constants.TIME_FORMAT);
  }

  get buildingMessage(): string {
    return this.currentFeaturesInformations.buildingMessage;
  }

  get landuseArea(): number {
    return this.currentFeaturesInformations.totalLanduseArea;
  }

  get residentialLanduseArea(): number {
    return this.currentFeaturesInformations.residentialLanduseArea;
  }

  get waterwayMessage(): string {
    return this.currentFeaturesInformations.waterwayMessage;
  }

  get buildingLayerColor(): string {
    return this.currentState.overviewMap.getColor("building");
  }

  get landuseLayerColor(): string {
    return this.currentState.overviewMap.getColor("landuse");
  }

  get waterwayLayerColor(): string {
    return this.currentState.overviewMap.getColor("waterway");
  }

  valueChanged(feature: keyof FeatureName) {
    store.setCheckBoxValue(feature);
  }
}
</script>

<style lang="scss">
.project-data-main-container {
  margin: 0px 16px 16px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.project-data-main-container__title {
  background-color: #f7f7f7;
  padding: 16px 16px 8px;
  font-size: 26px;
  font-weight: 800;
}

.project-data-sub-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: baseline;
}

.project-data-built {
  flex: 1 0 calc(33.3% - 96px);
  margin: 16px;
}

.project-building-data-container {
  margin-bottom: 16px;
  padding: 16px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.project-building-data-container__title {
  font-size: 22px;
  padding: 0 0 8px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid rgb(0, 188, 212);
}

.project-building-data-container__label-input {
  display: flex;
  align-items: baseline;
}

.project-building-data-container__paragraph {
  margin-bottom: 0px;
}

.project-landuse-data-container {
  margin: 16px 0px;
  padding: 16px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.project-landuse-data-container__title {
  font-size: 22px;
  padding: 0 0 8px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid rgb(0, 188, 212);
}

.project-landuse-data-container__label-input {
  display: flex;
  align-items: baseline;
}

.project-landuse-data-container__paragraph {
  margin-bottom: 0px;
}

.project-waterway-data-container {
  margin: 16px 0px;
  padding: 16px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.project-waterway-data-container__title {
  font-size: 22px;
  padding: 0 0 8px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid rgb(0, 188, 212);
}

.project-waterway-data-container__label-input {
  display: flex;
  align-items: baseline;
}

.project-waterway-data-container__paragraph {
  margin-bottom: 0px;
}

.project-data-main-container__title--dark-theme {
  background-color: #2c3e47;
}
</style>
