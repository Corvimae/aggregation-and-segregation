<template>
  <div class="grid" :style="{ '--columns': this.gridWidth }"> 
    <grid-square v-for="tile in tiles" :data="tile" :key="tile.id"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { EventBus } from "utils/EventBus";
import MoveSimulator from "utils/MoveSimulator";

import * as teams from "store/TeamStore";
import * as tiles from "store/TileStore";

import GridSquare from "components/GridSquare.vue";
import TileData from "data/TileData";
import { Team } from "data/Team";
import * as _ from "lodash";

@Component({ components: { GridSquare } })
export default class Grid extends Vue {
  get gridWidth(): number {
    return tiles.getWidth(this.$store);
  }

  get tiles(): TileData[] {
    return tiles.getTiles(this.$store);
  }

  get teams(): Team[] {
    return teams.getTeams(this.$store);
  }
}
</script>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(var(--columns), 25px);
}
</style>