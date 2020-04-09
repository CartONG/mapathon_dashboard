<template>
  <div class="project-data-main-container">
    <h2 class="project-data-main-container__title">Last update ({{ updateTime }})</h2>
    <div class="project-data-sub-container">
      <OverviewMap />
      <HighwayMap />
      <div class="project-data-built">
        <div class="project-building-data-container">
          <h4 class="project-building-data-container__title">
            Buildings <ColorDisplay :backgroundColor="buildingLayerColor" />
          </h4>
          <BaseInput class="project-building-data-container__label-input" label="Display buildings on the map" 
            name="building" type="checkbox" v-on:input='valueChanged("building")' checked="true"/>
          <p class="project-building-data-container__paragraph">{{ buildingMessage }}</p>
        </div>
        <div class="project-landuse-data-container">
          <h4 class="project-landuse-data-container__title">
            Landuse <ColorDisplay :backgroundColor="landuseLayerColor" />
          </h4>
          <BaseInput class="project-landuse-data-container__label-input" label="Display landuse on the map" 
            name="landuse" type="checkbox" v-on:input='valueChanged("landuse")' checked="true"/>
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
          <BaseInput class="project-waterway-data-container__label-input" label="Display waterways on the map" 
            name="waterway" type="checkbox" v-on:input='valueChanged("waterway")' checked="true"/>
          <p class="project-waterway-data-container__paragraph">{{ waterwayMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import BaseInput from './BaseInput.vue'
import ColorDisplay from './ColorDisplay.vue'
import HighwayMap from './HighwayMap.vue'
import OverviewMap from './OverviewMap.vue'

import { store } from './../../store'

import { IFeatureName } from './../../classes/feature-name-interface'

@Component(
  {
    components:
    {
      BaseInput,
      ColorDisplay,
      HighwayMap,
      OverviewMap
    }
  }
)
export default class extends Vue {
  private currentState = store.state;
  private currentOSMData = this.currentState.osmData;

  get updateTime()
  {
    return this.currentState.updateTime.format(store.constants.TIME_FORMAT);
  }

  get buildingMessage(): string
  {
    return this.currentOSMData.buildingMessage;
  }

  get landuseArea(): number
  {
    return this.currentOSMData.totalLanduseArea;
  }

  get residentialLanduseArea(): number
  {
    return this.currentOSMData.residentialLanduseArea;
  }

  get waterwayMessage(): string
  {
    return this.currentOSMData.waterwayMessage;
  }

  get buildingLayerColor(): string
  {
    return this.currentState.overviewMap.getColor("building");
  }

  get landuseLayerColor(): string
  {
    return this.currentState.overviewMap.getColor("landuse");
  }

  get waterwayLayerColor(): string
  {
    return this.currentState.overviewMap.getColor("waterway");
  }

  valueChanged(feature: keyof IFeatureName)
  {
    store.setCheckBoxValue(feature);
  }
}
</script>