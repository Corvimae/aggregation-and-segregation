<template>
  <div class="editor" :style="{ right: `${offset * 200}px`}">
    <h2>{{title}}</h2>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class BaseEditor extends Vue {
  @Prop()
  title!: string;

  @Prop({ default: 0 })
  offset!: number;
}
</script>

<style scoped>
.editor {
  position: absolute;
  display: block;
  top: 0;
  right: 0;
  width: 200px;
  height: 100%;
  border: 1px solid #333;
  background-color: #f0f0f0;
  overflow: auto;
}
</style>