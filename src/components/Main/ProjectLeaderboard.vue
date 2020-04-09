<template>
  <div class="project-leaderboard-container">
    <h2 class="project-leaderboard-container__title">Leaderboard</h2>
    <div v-if="isLeaderboardAvailable" class="project-leaderboard-sub-container">
      <div v-if="isLeaderboardForBuildingAvailable()" class="project-leaderboard-building-sub-container">
        <h4 class="project-leaderboard-building-sub-container__title">Buildings</h4>
        <ol>
          <li v-for='(currentRow, index) in currentBuildingList' :key="index" >{{ currentRow }}</li>
        </ol>
      </div>
      <div v-if="isLeaderboardForLanduseAvailable()" class="project-leaderboard-landuse-sub-container">
        <h4 class="project-leaderboard-landuse-sub-container__title">Landuse</h4>
        <ol>
          <li v-for='(currentRow, index) in currentLanduseList' :key="index" >{{ currentRow }}</li>
        </ol>
      </div>
      <div v-if="isLeaderboardForHighwayAvailable()" class="project-leaderboard-highway-sub-container">
        <h4 class="project-leaderboard-highway-sub-container__title">Roads</h4>
        <ol>
          <li v-for='(currentRow, index) in currentHighwayList' :key="index" >{{ currentRow }}</li>
        </ol>
      </div>
      <div v-if="isLeaderboardForWaterwayAvailable()" class="project-leaderboard-waterway-sub-container">
        <h4 class="project-leaderboard-waterway-sub-container__title">Waterways</h4>
        <ol>
          <li v-for='(currentRow, index) in currentWaterwayList' :key="index" >{{ currentRow }}</li>
        </ol>
      </div>
    </div>
    <div v-else class="project-leaderboard-no-data-container">
      <p class="project-leaderboard-no-data-container__paragraph">No data fetch for the given interval.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { store } from './../../store'

@Component
export default class extends Vue {
  private leaderboard = store.state.leaderboard;

  isLeaderboardForBuildingAvailable(): boolean
  {
    return this.leaderboard.building.length>0;
  }

  isLeaderboardForHighwayAvailable(): boolean
  {
    return this.leaderboard.highway.length>0;
  }  
  
  isLeaderboardForLanduseAvailable(): boolean
  {
    return this.leaderboard.landuse.length>0;
  }  
  
  isLeaderboardForWaterwayAvailable(): boolean
  {
    return this.leaderboard.waterway.length>0;
  }

  get isLeaderboardAvailable(): boolean
  {
    return this.isLeaderboardForBuildingAvailable() || this.isLeaderboardForHighwayAvailable() || this.isLeaderboardForLanduseAvailable() || this.isLeaderboardForWaterwayAvailable();
  }

  get currentBuildingList(): string[]
  {
    return this.leaderboard.building;
  }

  get currentHighwayList(): string[]
  {
    return this.leaderboard.highway;
  }

  get currentLanduseList(): string[]
  {
    return this.leaderboard.landuse;
  }

  get currentWaterwayList(): string[]
  {
    return this.leaderboard.waterway;
  }
}
</script>