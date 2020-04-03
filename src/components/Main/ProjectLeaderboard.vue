<template>
  <div class="task-box">
    <h2>Leaderboard</h2>
    <div v-if="isLeaderboardAvailable" class="task-grid">
      <div v-if="isLeaderboardForBuildingAvailable()" class="task-sub-section two-columns-task-sub-section">
        <h4>Buildings</h4>
        <ol>
          <li v-for='(currentRow, index) in currentBuildingList' :key="index" >{{ currentRow }}</li>
        </ol>
      </div>
      <div v-if="isLeaderboardForLanduseAvailable()" class="task-sub-section two-columns-task-sub-section">
        <h4>Landuse</h4>
        <ol>
          <li v-for='(currentRow, index) in currentLanduseList' :key="index" >{{ currentRow }}</li>
        </ol>
      </div>
      <div v-if="isLeaderboardForHighwayAvailable()" class="task-sub-section two-columns-task-sub-section">
        <h4>Roads</h4>
        <ol>
          <li v-for='(currentRow, index) in currentHighwayList' :key="index" >{{ currentRow }}</li>
        </ol>
      </div>
      <div v-if="isLeaderboardForWaterwayAvailable()" class="task-sub-section two-columns-task-sub-section">
        <h4>Waterways</h4>
        <ol>
          <li v-for='(currentRow, index) in currentWaterwayList' :key="index" >{{ currentRow }}</li>
        </ol>
      </div>
    </div>
    <div v-else class="task-grid">
      <p>No data fetch for the given interval.</p>
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