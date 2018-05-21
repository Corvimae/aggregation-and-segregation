<template>
  <div class="panel" v-on-clickaway="stopEditingName">
    <div class="toggle" >
      <input v-if="editNameMode" class="name-editor" type="text" :value="name" @keyup.enter="$emit('update-name', $event.target.value)" @keyup.esc="stopEditingName"/>
      <div class="edit-view" @click.self="$emit('update:expanded', !expanded)" v-else>
        <slot name="header-before"></slot>
        {{name}}
        <button class="edit-button" v-if="canEditName" @click.stop="startEditingName">&#9998;</button>
      </div>
    </div>
    <div class="contents" v-if="expanded">
      <slot name="contents"></slot>
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
  position: relative;
  display: flex;
  width: 100%;
  height: 40px;
  font-weight: bold;
  background-color: #ccc;
  border-bottom: 1px solid #333;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.panel:first-of-type .toggle {
  border-top: 1px solid #333;
}

.contents {
  border-bottom: 1px solid #333;
  background-color: rgba(255, 255, 255, 0.75);
  padding: 0;
  min-height: 50px;
}

.edit-view {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 4px 8px;
  align-items: center;
  justify-content: space-between;
}

.name-editor {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
}

.team-panel .edit-view {
  padding-left: 28px;
}
</style>