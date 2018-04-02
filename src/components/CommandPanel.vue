<template>
  <base-editor title="Commands" :offset="1">
    <button @click="randomizeGrid">Randomize Neighborhood Placements</button>

    <button @click="stepGridOnce">Step Once</button>
  </base-editor>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import BaseEditor from "components/BaseEditor";
import { Team } from "data/Team";
import MoveSimulator from "utils/MoveSimulator";

import * as teams from "store/TeamStore";
import * as tiles from "store/TileStore";

import * as _ from "lodash";

@Component({
  components: { BaseEditor }
})
export default class CommandPanel extends Vue {
  randomizeGrid() {
    let teamList: (Team | undefined)[] = [undefined];

    teamList = teamList.concat(teams.getTeams(this.$store));

    const tileList = tiles.getTiles(this.$store);

    tileList.forEach(tile => {
      tile.setTeam(_.sample(teamList));
    });

    tiles.updateTiles(this.$store, tileList);
  }

  stepGridOnce() {
    this.stepGrid(1);
  }

  private stepGrid(amount: number) {
    new MoveSimulator(this.$store).step();
  }
}
</script>

<style scoped>

</style>