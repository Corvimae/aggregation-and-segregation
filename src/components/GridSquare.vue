<template>
  <div class="grid-square" v-bind:style="[styles]" @click="toggleTeam">
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import TileData from "data/TileData";
import { Team } from "data/Team";

import * as teams from "store/TeamStore";
import * as tiles from "store/TileStore";

import * as _ from "lodash";

@Component
export default class GridSquare extends Vue {
  @Prop({ required: true })
  data!: TileData;

  get styles(): object {
    return {
      backgroundColor: this.data.getTeamColor(this.$store)
    };
  }

  toggleTeam() {
    const teamList: Team[] = teams.getTeams(this.$store);
    const team: Team | undefined = this.data.getTeam(this.$store);

    if (team) {
      const teamIndex: number = _.findIndex(teamList, possibleMatch => possibleMatch.id === team.id);

      if (teamIndex === teamList.length - 1) {
        this.data.setTeam(undefined);
      } else {
        this.data.setTeam(teamList[teamIndex + 1]);
      }
    } else {
      this.data.setTeam(teamList[0]);
    }

    tiles.updateTile(this.$store, this.data);
  }
}
</script>

<style scoped>
.grid-square {
  display: inline-block;
  width: 20px;
  height: 20px;
}
</style>