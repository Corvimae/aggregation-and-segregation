<template>  
  <svg :class="className" :width="width" :height="height">
    <use :xlink:href="key" />
  </svg>
</template>

<script>
export default {
  name: "icon",
  props: ["className", "key", "width", "height"]
};
</script>

<style scoped>
.icon {
  display: inline-block;
}
</style>  