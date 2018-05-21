<template>
  <collapseable-panel class="team-panel" :name="team.name" :canEditName="true" :expanded.sync="expanded" v-on:update-name="updateName">
    <template slot="header-before">
      <color-picker :backgroundColor="updatedTeamState.backgroundColor" v-on:update="updateTeamColor"/>
    </template>
    <template slot="contents">
      <team-neighbor-selector :team="updatedTeamState"/>
      
      <team-selection-rule-editor :team="updatedTeamState"/>
      
      <div class="panel-label">Search Method</div>
      <select class="search-method" v-model="updatedTeamState.searchMethod">
        <option value="PreferNearest">Prefer Nearest</option>
        <option value="PreferFarthest">Prefer Farthest</option>
        <option value="LeftToRight">Left to Right</option>
      </select>

      <div class="actions">
        <button @click="saveTeam">Save</button>
        <button @click="deleteTeam">Delete</button>
      </div>
    </template>
  </collapseable-panel>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import CollapseablePanel from "components/CollapseablePanel";
import ColorPicker from "components/ColorPicker";
import TeamNeighborSelector from "components/teams/TeamNeighborSelector";
import TeamSelectionRuleEditor from "components/teams/TeamSelectionRuleEditor";

import { Team } from "data/Team";
import * as teams from "store/TeamStore";

import * as _ from "lodash";

@Component({
  components: { CollapseablePanel, ColorPicker, TeamNeighborSelector, TeamSelectionRuleEditor }
})
export default class TeamPanel extends Vue {
  @Prop({ required: true })
  team!: Team;

  updatedTeamState: Team = this.team;

  expanded: boolean = false;

  saveTeam() {
    teams.updateTeam(this.$store, _.cloneDeep(this.updatedTeamState));
  }

  deleteTeam() {
    teams.removeTeam(this.$store, this.team);
  }

  updateTeamColor(color: string) {
    this.updatedTeamState.backgroundColor = color;
  }

  updateName(name: string) {
    this.team.name = name;
    teams.updateTeam(this.$store, this.team);
  }
}
</script>

<style scoped>
.panel-label {
  padding: 4px 8px;
  margin-top: 4px;
  border-top: 1px solid #333;
}

.search-method {
  margin: 0 8px;
}

.actions {
  display: flex;
  padding: 4px 8px;
  margin-top: 4px;
  border-top: 1px solid #333;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.actions button {
  flex-grow: 1;
}

.actions button:not(:last-child) {
  margin-right: 8px;
}
</style>