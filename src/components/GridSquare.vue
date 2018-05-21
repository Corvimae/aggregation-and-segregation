<template>
  <div class="grid-square" v-bind:style="[styles]"></div>
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
}
</script>

<style scoped>
.grid-square {
  display: inline-block;
  width: 20px;
  height: 20px;
}
</style>