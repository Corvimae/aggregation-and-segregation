<template>
  <div class="team-selection-rule">
    <select class="is-positive" v-model="isPositive">
      <option value="true">Must have</option>
      <option value="false">Cannot have</option>
    </select>
    <select class="limit-operand" v-model="limitOperand">
      <option value=">">more than</option>
      <option value=">=">at least</option>
      <option value="=">exactly</option>
      <option value="<=">at most</option>
      <option value="<">fewer than</option>
    </select>
    <input type="number" class="limit" v-model="limit"/>
    <span class="neighbors-label">&nbsp;neighbors from&nbsp;</span>
    <select v-model="limitingTeamId">
      <option :value="NoTeamRule">empty squares</option>
      <option v-for="team in teams" :value="team.id" :key="team.id">{{team.name}}</option>
      <option :value="AnyTeamRule">any group</option>
    </select>
    <button @click="$emit('row-deleted')">Delete</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Team, TeamSelectionRule, TeamSelectionRuleOperand, NoTeamRule, AnyTeamRule } from "data/Team";
import * as teams from "store/TeamStore";

@Component({
  components: {},
})
export default class TeamSelectionRuleRow extends Vue {
  NoTeamRule: number = NoTeamRule;
  AnyTeamRule: number = AnyTeamRule;
  
  @Prop({ required: true })
  rule!: TeamSelectionRule;

  isPositive: string = "" + this.rule.isPositive;
  limitOperand: TeamSelectionRuleOperand = this.rule.limitOperand;
  limit: string = "" + this.rule.limit;
  limitingTeamId: string = "" + this.rule.limitingTeamId;

  get teams(): Team[] {
    return teams.getTeams(this.$store);
  }

  @Watch("isPositive")
  @Watch("limitOperand")
  @Watch("limit")
  @Watch("limitingTeamId")
  update() {
    this.rule.limitingTeamId = Number(this.limitingTeamId);
    this.rule.limitOperand = this.limitOperand;
    this.rule.limit = Number(this.limit);
    this.rule.isPositive = Boolean(this.isPositive);
  }
}
</script>

<style scoped>
.team-selection-rule {
  border-bottom: 1px dashed #aaa;
  margin-bottom: 4px;
  padding: 4px 8px;
}

.limit {
  width: 40px;
  text-align: center;
}
</style>