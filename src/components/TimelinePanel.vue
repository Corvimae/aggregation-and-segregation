<template>
  <div class="timeline-panel">
    <div class="timeline-panel-row">
      <input type="range"
        class="timeline-scrubber"
        min="0"
        :max="gridStateCount"
        :value="gridHistoryPosition"
        @input="changeHistoricalPosition($event.target.value)"/>
      <button class="play-toggle" @click="play" v-if="!isRunning"><span>&#9654;</span></button>
      <button class="play-toggle pause" @click="pause" v-else><span>&#9632;</span></button>
    </div>
    <div class="timeline-panel-row">
      <button @click="stepGrid">Step Once</button>
      <button class="randomize-grid" @click="randomizeGrid">Randomize Neighborhood Placements</button>
      <div class="speed-container">
        <div class="speed-icon">&#128034;</div>
        <input type="range"
          class="step-speed-selector"
          min="0"
          max="950"
          value="500"
          @input="updateStepDelay($event.target.value)"/>
        <div class="speed-icon">&#128007;</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MoveSimulator from "utils/MoveSimulator";

import { Team } from "data/Team";

import * as teams from "store/TeamStore";
import * as tiles from "store/TileStore";

import * as _ from "lodash";
import TileData from "data/TileData";
import { clearInterval } from "timers";

@Component({})
export default class CommandPanel extends Vue {
  stepInterval: NodeJS.Timer | null = null;
  stepDelay: number = 500;

  get gridStateCount() {
    return tiles.getHistoryLength(this.$store) - 1;
  }

  get gridHistoryPosition() {
    return tiles.getHistoryPosition(this.$store);
  }

  get isRunning(): boolean {
    return this.stepInterval !== null;
  }

  changeHistoricalPosition(position: string) {
    return tiles.setHistoryPosition(this.$store, Number(position));
  }

  updateStepDelay(stepRate: string) {
    this.stepDelay = 1000 - Number(stepRate);
    if(this.isRunning) {
      this.pause();
      this.play();
    }
  }

  stepGrid() {
    const gridBefore = tiles.getTiles(this.$store);
    new MoveSimulator(this.$store).step();

    if(this.areGridsEqual(gridBefore, tiles.getTiles(this.$store))) {
      this.pause();
    }
  }

  areGridsEqual(before: tiles.TileGrid, after: tiles.TileGrid) {
    if(before.length !== after.length || before[0].length !== after[0].length) {
      return false;
    } else {
      for(let y = 0; y < before.length; y++) {
        for(let x = 0; x < before[0].length; x++) {
          if(before[y][x].teamId !== after[y][x].teamId) return false;
        }
      }
    }

    return true;
  }

  play() {
    Vue.set(
      this,
      "stepInterval",
      global.setInterval(this.stepGrid, this.stepDelay)
    );
  }

  pause() {
    global.clearInterval(this.stepInterval!);

    this.stepInterval = null;
  }

  randomizeGrid() {
    let teamList: (Team | undefined)[] = [undefined];

    teamList = teamList.concat(teams.getTeams(this.$store));

    const tileList: tiles.TileGrid = tiles.getTiles(this.$store);

    tileList.forEach(row => {
      row.forEach(tile => {
        tile.setTeam(_.sample(teamList));
      });
    });

    tiles.clearHistory(this.$store);

    tiles.updateTiles(this.$store, { tiles: tileList, saveState: true });
  }
}
</script>

<style scoped>
.timeline-panel {
  position: absolute;
  display: flex;
  bottom: 0px;
  left: 50%;
  padding: 8px 10px;
  transform: translate(-50%, 0);
  width: 800px;
  height: 70px;
  background-color: rgba(220, 220, 220, 0.5);
  border-radius: 4px 4px 0 0;
  flex-direction: column;
  justify-content: center;
}

.timeline-panel-row {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 5px;
}

.timeline-scrubber {
  width: 100%;
  flex-shrink: 1;
  margin-right: 20px;
}

.play-toggle {
  width: 28px;
  height: 28px;
}

.pause span {
  font-size: 1.25rem;
  vertical-align: top;
  line-height: 14px;
}

.speed-icon {
  vertical-align: top;
  line-height: 0;
}

.speed-container {
  display: flex;
  flex-direction: row;
  margin-left: auto;
  align-items: center;
  justify-content: center;
}

.randomize-grid {
  margin-left: 10px;
}
</style>