<template>
  <div class="task-box">
    <h2>Last update ({{ updateTime }})</h2>
    <div id="task-data-box">
      <OverviewMap />
      <HighwayMap />
      <div class="three-columns-task-sub-section">
        <div id="buildings" class="task-sub-section box-shadow-data three-rows-one-column-data">
          <h4>
            Buildings <ColorDisplay :backgroundColor="buildingLayerColor" />
          </h4>
          <BaseInput id="buildings-checkbox" label="Display buildings on the map" 
            name="building" type="checkbox" v-on:input='valueChanged("building")' checked="true"/>
          <p>{{ buildingMessage }}</p>
        </div>
        <div id="landuse" class="task-sub-section box-shadow-data three-rows-one-column-data">
          <h4>
            Landuse <ColorDisplay :backgroundColor="landuseLayerColor" />
          </h4>
          <BaseInput id="landuse-checkbox" label="Display landuse on the map" 
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
        <div id="waterways" class="task-sub-section box-shadow-data three-rows-one-column-data">
          <h4>
            Waterways <ColorDisplay :backgroundColor="waterwayLayerColor" />
          </h4>
          <BaseInput id="waterways-checkbox" label="Display waterways on the map" 
            name="waterway" type="checkbox" v-on:input='valueChanged("waterway")' checked="true"/>
          <p>{{ waterwayMessage }}</p>
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