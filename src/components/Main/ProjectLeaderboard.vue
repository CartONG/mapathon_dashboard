<template>
  <div class="project-leaderboard-container">
    <h2 :class="projectLeaderboardTitleClasses">Leaderboard</h2>
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

  get projectLeaderboardTitleClasses(): string
  {
    return "project-leaderboard-container__title" + (store.state.isThemeDark?" project-leaderboard-container__title--dark-theme":"")
  }

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

<style>
.project-leaderboard-container {
  margin: 16px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
}

.project-leaderboard-container__title {
  background-color: #f7f7f7;
  padding: 16px 16px 8px;
  margin-bottom: 0px;
  font-size: 26px;
  font-weight: 800;
}

.project-leaderboard-sub-container {
  display: flex;
  align-content: baseline;
  flex-flow: row nowrap;
}

.project-leaderboard-building-sub-container {
  flex: 1 0 content;
  align-self: baseline;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  padding: 16px 16px 0px;
  margin: 16px;
}

.project-leaderboard-building-sub-container__title {
  font-size: 22px;
  padding: 0 0 8px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid rgb(0,188,212);
}

.project-leaderboard-highway-sub-container {
  flex: 1 0 content;
  align-self: baseline;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  padding: 16px 16px 0px;
  margin: 16px;
}

.project-leaderboard-highway-sub-container__title {
  font-size: 22px;
  padding: 0 0 8px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid rgb(0,188,212);
}

.project-leaderboard-landuse-sub-container {
  flex: 1 0 content;
  align-self: baseline;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  padding: 16px 16px 0px;
  margin: 16px;
}

.project-leaderboard-landuse-sub-container__title {
  font-size: 22px;
  padding: 0 0 8px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid rgb(0,188,212);
}

.project-leaderboard-waterway-sub-container {
  flex: 1 0 content;
  align-self: baseline;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  padding: 16px 16px 0px;
  margin: 16px;
}

.project-leaderboard-waterway-sub-container__title {
  font-size: 22px;
  padding: 0 0 8px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid rgb(0,188,212);
}

.project-leaderboard-no-data-container {
  display: flex;
  justify-content: center;
}

.project-leaderboard-no-data-container__paragraph {
  padding: 8px;
  margin-bottom: 0px;
}

.project-leaderboard-container__title--dark-theme {
  background-color:#2C3E47;
}
</style>