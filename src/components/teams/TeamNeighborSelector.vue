<template>
  <div class="neighbor-selector">
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
    if(index !== 4) {
      Vue.set(this.statuses, index, !this.statuses[index]);
    }
  }

}
</script>

<style scoped>
.neighbor-selector {
  padding: 0 8px;
}

.editor-label {
  padding: 4px 0;
}

.selector-container {
  display: inline-grid;
  grid-template-columns: repeat(3, 25px);
  grid-gap: 1px;
  background-color: #fff;
}

.selector-item {
  width: 25px;
  height: 25px;
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