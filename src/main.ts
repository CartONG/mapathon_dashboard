import "./string.extension";

import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

import { library } from "@fortawesome/fontawesome-svg-core";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faSun, faMoon);

Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  render: h => h(App)
}).$mount("#app");
