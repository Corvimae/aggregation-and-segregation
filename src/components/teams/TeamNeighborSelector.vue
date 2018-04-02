<template>
  <div>
    <div class="editor-label">Consider Neighbors</div>
    <div class="selector-container">
      <div class="selector-item" 
        v-for="(value, index) in statuses" 
        :key="index"
        :class="[{ 'self-selector': index === 4, active: value}]" 
        @click="toggleStatus(index)"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Team } from "data/Team";
import * as teams from "store/TeamStore";

import * as _ from "lodash";

@Component({
  components: {}
})
export default class TeamNeighborSelector extends Vue {
  @Prop({ required: true })
  team!: Team;

  statuses: boolean[] = this.team.neighborStatuses;

  toggleStatus(index: number) {
    Vue.set(this.statuses, index, !this.statuses[index]);
  }

}
</script>

<style scoped>
.selector-container {
  display: grid;
  grid-template-columns: repeat(3, 25px);
}

.selector-item {
  width: 25px;
  height: 25px;
  border: 1px solid #fff;
  background-color: #e26b67;
  box-sizing: border-box;
}

.selector-item.active {
  background-color: #a1e267;
}

.self-selector {
  background-color: #999;
}
</style>