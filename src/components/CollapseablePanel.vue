<template>
  <div class="panel" v-on-clickaway="stopEditingName">
    <div class="toggle" @click="$emit('update:expanded', !expanded)">
      <input v-if="editNameMode" type="text" :value="name" @keyup.enter="$emit('update-name', $event.target.value)" @keyup.esc="stopEditingName"/>
      <span v-else>
        {{name}}
        <button v-if="canEditName" @click.stop="startEditingName">Rename</button>
      </span>
    </div>
    <div class="contents" v-if="expanded">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import { mixin as clickaway } from "vue-clickaway";

@Component({ 
  mixins: [clickaway]
})
export default class CollapseablePanel extends Vue {
  @Prop({ required: true })
  name!: string;

  @Prop({ default: false })
  canEditName!: boolean;

  editNameMode: boolean = false;

  @Prop({ default: false })
  expanded: boolean = false;

  startEditingName() {
    this.editNameMode = true;
  }

  stopEditingName() {
    this.editNameMode = false;
  }
}
</script>

<style scoped>
.toggle {
  width: 100%;
  height: 20px;
  font-weight: bold;
  background-color: #ccc;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
}

.contents {
  border-bottom: 1px solid #333;
  background-color: #fff;
  min-height: 50px;
}
</style>