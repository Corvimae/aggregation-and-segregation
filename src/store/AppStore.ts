import Vuex, { ActionContext, Store } from "vuex";
import { getStoreAccessors } from "vuex-typescript";
import { TeamState, TeamConfiguration } from "store/TeamStore";
import { TileState, TileConfiguration } from "store/TileStore";

import Vue from "vue";

Vue.use(Vuex);

export interface AppState {
  teams: TeamState,
  tiles: TileState
}

export type AppStore = Store<AppState>;

export default new Store<AppState>({
  modules: {
    teams: TeamConfiguration,
    tiles: TileConfiguration
  },
  strict: true
});