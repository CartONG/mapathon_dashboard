<template>
  <main>
    <SearchBar />
    <Project />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SearchBar from './Main/SearchBar.vue'
import Project from './Main/Project.vue'

@Component({
  components:
  {
    Project,
    SearchBar
  }
})
export default class extends Vue
{

}
</script>