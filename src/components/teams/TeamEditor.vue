<template>
  <base-editor title="Edit Teams">
    <team-panel v-for="team in teams" :key="team.name" :team="team"/>

    <button class="new-team" @click="createNewTeam">New Team</button>
  </base-editor>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import BaseEditor from "components/BaseEditor";
import TeamPanel from "components/teams/TeamPanel";
import { Team } from "data/Team";
import * as teams from "store/TeamStore";

@Component({
  components: { BaseEditor, TeamPanel }
})
export default class TeamEditor extends Vue {
  get teams(): Team[] {
    return teams.getTeams(this.$store);
  }

  createNewTeam() {
    teams.addTeam(this.$store);
  }
}
</script>

<style scoped>
.new-team {
  margin: 10px 8px;
}
</style>