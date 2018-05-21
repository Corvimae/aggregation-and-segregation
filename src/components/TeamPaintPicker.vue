<template>
  <div class="grid-square" :class="{selected: selected, light: isLight}" :style="{backgroundColor: team.backgroundColor}"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Team } from "data/Team";

@Component
export default class TeamPaintPicker extends Vue {
  @Prop({ default: false })
  selected: boolean = false;

  @Prop({ required: true })
  team!: Team;

  get isLight() {
    const rgb = parseInt(this.team.backgroundColor.substring(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 128;
  }
}
</script>

<style scoped>
.paint-option {
  width: 30px;
  height: 30px;
  margin-bottom: 10px;
}

.paint-option.selected {
  border: 3px solid rgba(255, 255, 255, 0.5);
}

.paint-option.selected.light {
  border: 3px solid rgba(0, 0, 0, 0.5);
}
</style>