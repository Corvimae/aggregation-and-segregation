import Vue from "vue";
import App from "./App.vue";

(<any>window).App = new Vue({
  el: "#app",
  render: h => h(App)
})
