<template>
  <div class="app">
    <div class="mid">
      <div class="instructions">
        Click a color to select a team, then click a square in the grid to assign the selected team to that location.
      </div>
      <grid/>
    </div>
    <team-editor/>
    <timeline-panel/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from "vue-property-decorator";

import Grid from "components/Grid";
import TeamEditor from "components/teams/TeamEditor";
import TimelinePanel from "components/TimelinePanel";

import AppStore from "store/AppStore";
import * as teams from "store/TeamStore";
import { initializeGrid } from "store/TileStore";
import { TeamSelectionRule, Team } from "data/Team";

@Component({
  components: { Grid, TeamEditor, TimelinePanel },
  store: AppStore
})
export default class App extends Vue {
  constructor() {
    super();

    if (this.$store.state.teams.teams.length === 0) {
      teams.addTeam(this.$store);
      teams.addTeam(this.$store);

      teams.getTeams(this.$store).forEach((team: Team, index: number) => {
        team.rules.push(new TeamSelectionRule(team.id, ">=", 3, true));

        teams.updateTeam(this.$store, team);
      });
    }

    initializeGrid(this.$store);
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

.mid {
  flex-grow: 1;
  box-sizing: border-box;
}

.instructions {
  margin: 10px;
  color: #fff;
  font-size: 0.8rem;
}
</style>
