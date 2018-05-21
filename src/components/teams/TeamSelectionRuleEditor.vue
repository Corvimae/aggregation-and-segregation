<template>
  <div>
    <div class="panel-label">Selection Rules</div>
    <team-selection-rule-row
      v-for="(rule, index) in team.rules"
      :key="index"
      :rule="rule"
      @row-deleted="onRowDeleted(rule)"/>

    <button class="add-rule" @click="addRule">Add Rule</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Team, TeamSelectionRule } from "data/Team";
import * as teams from "store/TeamStore";

import TeamSelectionRuleRow from "components/teams/TeamSelectionRuleRow";

@Component({
  components: { TeamSelectionRuleRow }
})
export default class TeamSelectionRuleEditor extends Vue {
  @Prop({ required: true })
  team!: Team;

  addRule() {
    this.team.rules.push(new TeamSelectionRule(-1, "=", 0, true));
  }

  onRowDeleted(rule: TeamSelectionRule) {
    this.team.rules.splice(this.team.rules.indexOf(rule), 1);
  }
}
</script>

<style scoped>
.panel-label {
  margin-top: 8px;
  padding: 4px 8px;
  border-top: 1px solid #333;
}

.add-rule {
  margin: 0 8px;
}
</style>