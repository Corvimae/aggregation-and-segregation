<template>
  <div class="color-picker">
    <div class="toggle" :style="[styles]" @click.stop="toggle"></div>
    <sketch v-if="expanded" v-model="selectedBackgroundColor" v-on-clickaway="hide"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Sketch, ColorPickerResult } from "vue-color";
import { mixin as clickaway } from "vue-clickaway";

@Component({
  components: { Sketch },
  mixins: [ clickaway ],
  model: {
    prop: "backgroundColor",
    event: "change"
  }
})
export default class ColorPicker extends Vue {
  @Prop({ required: true })
  backgroundColor!: string;

  expanded: boolean = false;

  selectedBackgroundColor: string = this.backgroundColor;

  toggle() {
    this.expanded = !this.expanded;
  }

  hide() {
    this.expanded = false;
    this.$emit("update", this.selectedBackgroundColor);
  }

  @Watch("selectedBackgroundColor")
  onBackgroundColorChange(newValue: ColorPickerResult | string) {
    if(newValue && (<ColorPickerResult>newValue).hex) {
      this.selectedBackgroundColor = (<ColorPickerResult>newValue).hex;
    }
  }

  get styles(): object {
    return {
      backgroundColor: this.selectedBackgroundColor
    }
  }
}
</script>

<style scoped>
.color-picker {
  position: absolute;
  left: 0;
  height: 100%;
}

.toggle {
  position: relative;
  width: 20px;
  height: 100%;
  box-sizing: border-box;
}

.vc-sketch {
  position: absolute;
  z-index: 1000;
}
</style>