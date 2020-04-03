<template>
  <form id="search-bar-form" @submit="submit">
    <BaseInput id="project-id-input" v-on:input="projectId=$event.target.value" :value="this.currentState.projectId" type="number" name="projectID" label="Project ID" min=0 required=true />
    <BaseInput id="start-date-input" v-on:input="setStartDateTime($event.target.value)" type="text" :value="startDateTime" name="startDate" :label="startDateTimeZone" required=true />
    <BaseInput id="end-date-input" v-on:input="setEndDateTime($event.target.value)" type="text" :value="endDateTime" name="endDate" :label="endDateTimeZone" required=true />
    <select id="server-select">
      <option disabled value="">Please select one</option>
      <option v-for="(value, key) in servers" :key=key :value="value">{{key}}</option>
    </select>
    <input type="submit" value="Submit">
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
  private chosenServer = store.constants.SERVERS["overpass-api.de"];
  
  get startDateTimeZone(): string
  {
    return 'Start ('+this.currentState.currentTimeZone+')';
  };

  get endDateTimeZone(): string
  {
    return 'End ('+this.currentState.currentTimeZone+')';
  };

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

  get servers(): Object
  {
    return store.constants.SERVERS;
  };

  submit(event: Event)
  {
    store.setSearchBarValues(this.projectId, this.chosenServer);
    event.preventDefault();
  };
}
</script>