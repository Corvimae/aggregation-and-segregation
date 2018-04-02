<template>
  <div class="color-picker">
    <div class="toggle" @click="toggle">
      <div class="toggle-inner" :style="[styles]"></div>
    </div>
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
  position: relative;
}

.toggle {
  position: relative;
  width: 40px;
  height: 40px;
  border: 1px solid #333;
  box-sizing: border-box;
}

.toggle-inner {
  position: relative;
  width: 34px;
  height: 34px;
  left: 2px;
  top: 2px;
  box-sizing: border-box;
}

.vc-sketch {
  position: absolute;
}
</style>