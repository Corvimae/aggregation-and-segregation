<template>
  <div class="grid-container">
    <div class="grid" :style="{ '--columns': this.gridWidth }">
      <grid-square v-for="tile in tiles" :data="tile" :key="tile.id"/>
    </div>
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
    return _.flatten(tiles.getTiles(this.$store));
  }

  get teams(): Team[] {
    return teams.getTeams(this.$store);
  }
}
</script>
<style scoped>
.grid-container {
  position: relative;
  top: 10px;
  left: 10px;
  width: 100%;
  display: block;
}
.grid {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  border: 1px solid #4a4a4b;
  grid-gap: 1px;
  background-color: #4a4a4b;
}
</style>