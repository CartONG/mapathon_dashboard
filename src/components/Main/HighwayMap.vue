<template>
  <div class="project-highway-map">
    <div>
      <h4 class="project-highway-map__title">
        Roads <ColorDisplay :backgroundColor="highwayLayerColor" />
      </h4>
      <div class="project-highway-map-main-container">
        <BaseInput
          class="project-highway-map-main-container__label-input"
          label="Display roads on the map"
          name="highway"
          type="checkbox"
          v-on:input="valueChanged()"
          checked="true"
        />
        <p class="project-highway-map-main-container__paragraph">
          {{ highwayMessage }}
        </p>
        <div id="highway-map"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import BaseInput from "./BaseInput.vue";
import ColorDisplay from "./ColorDisplay.vue";

import { store } from "@/store";

@Component({
  components: {
    BaseInput,
    ColorDisplay,
  },
})
export default class extends Vue {
  private currentState = store.state;

  mounted() {
    // Check that navigator got "geolocation" property and that we didn't ask the user for his geolocation before
    if ("geolocation" in navigator && !this.currentState.askedLocation) {
      this.currentState.askedLocation = true;
      //Ask the user if he/she accepts to share his/her position for the starting point of the highway map
      navigator.geolocation.getCurrentPosition(
        // eslint-disable-next-line
          function onSuccess(position: GeolocationPosition) {
          store.displayHighwayMap(position);
        },
        function onError() {
          store.displayHighwayMap();
        }
      );
    } else {
      store.displayHighwayMap();
    }
  }

  beforeDestroy() {
    store.destroyHighwayMap();
  }

  get highwayMessage(): string {
    return this.currentState.featuresInformations.highwayMessage;
  }

  get highwayLayerColor(): string {
    return this.currentState.overviewMap.getColor("highway");
  }

  valueChanged() {
    store.setCheckBoxValue("highway");
  }
}
</script>

<style lang="scss">
.project-highway-map {
  flex: 1 0 calc(33.3% - 96px);
  margin: 16px;
  padding: 16px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.project-highway-map__title {
  font-size: 22px;
  padding: 0 0 8px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid rgb(0, 188, 212);
}

.project-highway-map-main-container {
  display: flex;
  flex-flow: row wrap;
}

.project-highway-map-main-container__label-input {
  display: flex;
  flex: 1 0 100%;
  align-items: baseline;
}

.project-highway-map-main-container__paragraph {
  margin-bottom: 0px;
}

#highway-map {
  width: 100%;
  height: 275px;
}
</style>
