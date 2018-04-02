<template>
  <div class="app">
    <grid/>
    <team-editor/>
    <command-panel/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import Grid from "components/Grid";
import TeamEditor from "components/teams/TeamEditor";
import CommandPanel from "components/CommandPanel";

import AppStore from "store/AppStore";
import { addTeam } from "store/TeamStore";
import { initializeGrid } from "store/TileStore";

@Component({ components: { Grid, TeamEditor, CommandPanel }, store: AppStore })
export default class App extends Vue {
  constructor() {
    super();

    if (this.$store.state.teams.teams.length === 0) {
      addTeam(this.$store);
      addTeam(this.$store);
    }

    initializeGrid(this.$store);
  }
}
</script>

<style scoped>
.app {
  font-family: Helvetica, Tahoma, sans-serif;
  font-size: 16px;
}
</style>
