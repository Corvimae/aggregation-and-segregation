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
  @Prop() title!: string;

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
  width: 260px;
  height: 100%;
  border: 1px solid #333;
  background-color: rgba(220, 220, 220, 0.5);
  overflow: auto;
  z-index: 99;
}

.editor h2 {
  margin: 12px 8px;
}
</style>