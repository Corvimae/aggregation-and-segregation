<template>
  <div class="grid-container">
    <div class="paint-options">
      <team-paint-picker 
        v-for="team in teams"
        class="paint-option"
        :key="team.id"
        :team="team"
        :selected="selectedTeam === team.id"
        @click.native="selectedTeam = team.id"/>
    </div>
    <div class="grid" :style="{ '--columns': this.gridWidth }">
      <grid-square v-for="tile in tiles" :data="tile" :key="tile.id" @mouseover.native="paintTeam($event, tile)"/>
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
import TeamPaintPicker from "components/TeamPaintPicker.vue";

import TileData from "data/TileData";
import { Team } from "data/Team";
import * as _ from "lodash";

@Component({ components: { GridSquare, TeamPaintPicker } })
export default class Grid extends Vue {
  selectedTeam: number = -1;

  get gridWidth(): number {
    return tiles.getWidth(this.$store);
  }

  get tiles(): TileData[] {
    return _.flatten(tiles.getTiles(this.$store));
  }

  get teams(): Team[] {
    return teams.getTeams(this.$store);
  }

  paintTeam(event: MouseEvent, tile: TileData) {
    console.log(this.selectedTeam);
    if(event.which === 1 && this.selectedTeam !== -1) {
      tile.teamId = this.selectedTeam;
      
      tiles.updateTile(this.$store, tile);
    }
  }
}
</script>
<style scoped>
.grid-container {
  position: relative;
  display: flex;
  top: 10px;
  width: 100%;
  flex-direction: row;
}
.grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  border: 1px solid #4a4a4b;
  grid-gap: 1px;
  background-color: #4a4a4b;
}

.paint-options {
  display: flex;
  width: 50px;
  flex-direction: column;
  align-items: center;
}

</style>