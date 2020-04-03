<template>
  <div class="task-sub-section three-columns-task-sub-section box-shadow-data">
    <div id="roads">
      <h4>
        Roads <ColorDisplay :backgroundColor="highwayLayerColor" />
      </h4>
      <div>
        <BaseInput id="roads-checkbox" label="Display roads on the map" 
          name="highway" type="checkbox" v-on:input="valueChanged()" checked="true" />
        <p> {{ highwayMessage }}</p>
        <div id="highway-map">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator'

import BaseInput from './BaseInput.vue'
import ColorDisplay from './ColorDisplay.vue'

import { store } from '../../store'

@Component(
  {
    components:
    {
      BaseInput,
      ColorDisplay
    }
  }
)
export default class extends Vue {
  private currentState = store.state;

  mounted()
  {
    // Check that navigator got "geolocation" property and that we didn't ask the user for his geolocation before
    if("geolocation" in navigator && !this.currentState.askedLocation)
    {
      this.currentState.askedLocation = true;
      //Ask the user if he/she accepts to share his/her position for the starting point of the highway map
      navigator.geolocation.getCurrentPosition(function onSuccess(position: Position)
      {
        store.displayHighwayMap(position);
      },
      function onError()
      {
        store.displayHighwayMap();
      })
    }
    else
    {
      store.displayHighwayMap();
    }
  }

  beforeDestroy()
  {
    store.destroyHighwayMap();
  }

  get highwayMessage(): string
  {
    return this.currentState.osmData.highwayMessage;
  }

  get highwayLayerColor(): string
  {
    return this.currentState.overviewMap.getColor("highway");
  }

  valueChanged()
  {
    store.setCheckBoxValue("highway");
  }
}
</script>