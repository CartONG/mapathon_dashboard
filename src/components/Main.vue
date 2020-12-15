<template>
  <main>
    <div class="top-bar-container">
      <SearchBar />
      <SwitchThemeButton />
    </div>
    <Project />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SearchBar from "./Main/SearchBar.vue";
import Project from "./Main/Project.vue";
import SwitchThemeButton from "./Main/SwitchThemeButton.vue";

@Component({
  components: {
    Project,
    SearchBar,
    SwitchThemeButton
  }
})
export default class extends Vue {}
</script>

<style lang="scss">
.top-bar-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: baseline;
}
</style>
