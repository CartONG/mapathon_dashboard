<template>
  <form class="search-bar" @submit="submit">
    <BaseInput class="search-bar-field" v-on:input="projectId=$event.target.value" :value="projectId" type="number" name="projectID" label="Project ID" min=0 required=true :isThemeDark=currentState.isThemeDark />
    <BaseInput class="search-bar-field" v-on:input="setStartDateTime($event.target.value)" type="text" :value="startDateTime" name="startDate" :label="startDateTimeZone" required=true :isThemeDark=currentState.isThemeDark />
    <BaseInput class="search-bar-field" v-on:input="setEndDateTime($event.target.value)" type="text" :value="endDateTime" name="endDate" :label="endDateTimeZone" required=true :isThemeDark=currentState.isThemeDark />
    <select :class="taskingManagerSelectionClasses" id="tasking-manager-select" v-model="chosenTaskingManager">
      <option disabled value="">Tasking Manager selection</option>
      <option v-for="(value, key) in taskingManagers" :key=key :value="key">{{key}}</option>
    </select>
    <select :class="serverSelectionClasses" v-model="chosenServerURL">
      <option disabled value="">OSM server selection</option>
      <option v-for="(value, key) in servers" :key=key :value="value">{{key}}</option>
    </select>
    <input :class="submitClasses" type="submit" value="Submit">
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import * as moment from 'moment'
import { store } from '../../store'

import BaseInput from './BaseInput.vue'

@Component({
  components:
  {
    BaseInput
  }
})
export default class extends Vue
{
  private currentState = store.state;
  private projectId = this.currentState.projectId;
  private startDateTime = store.state.startDateTime.format(store.constants.DATETIME_FORMAT);
  private endDateTime = store.state.endDateTime.format(store.constants.DATETIME_FORMAT);
  private chosenServerURL = store.constants.SERVERS["overpass-api.de"];
  private chosenTaskingManager = "Humanitarian OSM Team";
  
  get taskingManagerSelectionClasses(): string 
  {
    return "tasking-manager-selection" +(this.currentState.isThemeDark?" tasking-manager-selection--dark-theme":"");
  }

  get serverSelectionClasses(): string 
  {
    return "server-selection" +(this.currentState.isThemeDark?" server-selection--dark-theme":"");
  };

  get submitClasses(): string 
  {
    return "input-submit" +(this.currentState.isThemeDark?" input-submit--dark-theme":"");
  }

  get startDateTimeZone(): string
  {
    return 'Start ('+this.currentState.currentTimeZone+')';
  }

  get endDateTimeZone(): string
  {
    return 'End ('+this.currentState.currentTimeZone+')';
  }

  setEndDateTime(value: string)
  {
    this.endDateTime = value;
    this.currentState.endDateTime = moment(value, store.constants.DATETIME_FORMAT);
  }

  setStartDateTime(value: string)
  {
    this.startDateTime = value;
    this.currentState.startDateTime = moment(value, store.constants.DATETIME_FORMAT);
  }

  get taskingManagers()
  {
    return store.constants.TASKING_MANAGER_URLS;
  }

  get servers()
  {
    return store.constants.SERVERS;
  }

  submit(event: Event)
  {
    store.setSearchBarValues(this.projectId, this.chosenServerURL, this.chosenTaskingManager);
    event.preventDefault();
  }
}
</script>

<style>
.search-bar {
  display: flex;
  /* flex-direction: row;
  flex-wrap: nowrap; */
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: baseline;
  margin: 1rem;
}

.search-bar-field {
  display: flex;
  margin: 5px;
  align-items: baseline;
  flex: 1 0 auto;
}

.tasking-manager-selection {
  margin: 10px 0px 10px 20px;
  flex: 1 0 content;
}

.server-selection {
  margin: 10px 20px;
  flex: 1 0 content;
}

.tasking-manager-selection--dark-theme {
  background-color: #182b36;
}

.server-selection--dark-theme {
  background-color: #182b36;
}
</style>