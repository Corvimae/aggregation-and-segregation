import { Store, StoreOptions, ActionContext } from "vuex";
import { getStoreAccessors } from "vuex-typescript";
import { AppState } from "store/AppStore";
import TileData from "data/TileData";
import Vue from "vue";
import * as _ from "lodash";
import { Coordinate } from "utils/MoveSimulator";

const DEFAULT_WIDTH = 25;
const DEFAULT_HEIGHT = DEFAULT_WIDTH;

export type TileGrid = TileData[][];
export interface TileState {
  tiles: TileGrid,
  stepHistory: TileGrid[],
  currentHistoryPosition: number,
  width: number,
  height: number
};

type TileContext = ActionContext<TileState, AppState>;

export const TileConfiguration = {
  namespaced: true,

  state: {
    tiles: [],
    stepHistory: [],
    currentHistoryPosition: 0,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },

  getters: {
    getTiles(state: TileState): TileGrid {
      return state.tiles.map(_.cloneDeep);
    },

    getTile(state: TileState): (x: number, y: number) => TileData | undefined {
      return (x: number, y: number) => {
        const tile: TileData | undefined = state.tiles[y] && state.tiles[y][x];

        if (tile) {
          return _.cloneDeep(tile);
        } else {
          return undefined;
        }
      }
    },

    getTileByCoordinate(state: TileState): (coord: Coordinate) => TileData | undefined {
      return (coord: Coordinate) => {
        const tile: TileData | undefined = state.tiles[coord.y] && state.tiles[coord.y][coord.x]

        if (tile) {
          return _.cloneDeep(tile);
        } else {
          return undefined;
        }
      }
    },

    getWidth(state: TileState): number {
      return state.width;
    },

    getHeight(state: TileState): number {
      return state.height;
    },

    getHistoryPosition(state: TileState): number {
      return state.currentHistoryPosition;
    },

    getHistoryLength(state: TileState): number {
      return state.stepHistory.length;
    },

    getHistoryState(state: TileState): (position: number) => TileGrid {
      return (position: number) => _.cloneDeep(state.stepHistory[position]);
    }
  },

  mutations: {
    updateTile(state: TileState, tileToUpdate: TileData) {
      Vue.set(state.tiles[tileToUpdate.y], tileToUpdate.x, tileToUpdate);
    },

    updateTiles(state: TileState, payload: { tiles: TileGrid, saveState?: boolean }) {
      if (payload.saveState) {
        state.stepHistory.splice(state.currentHistoryPosition + 1);
      }

      state.tiles = payload.tiles;

      if (payload.saveState) {
        state.stepHistory.push(payload.tiles);
        state.currentHistoryPosition += 1;
      }
    },

    resize(state: TileState, payload: { width: number, height: number }) {
      state.width = payload.width;
      state.height = payload.height;

      state.currentHistoryPosition = 0;
      state.stepHistory.splice(0);

      // Create a new "blank" table.
      let newTable: TileGrid = [];

      for (let y: number = 0; y < payload.height; y++) {
        newTable.push([]);

        for (let x: number = 0; x < payload.width; x++) {
          const existingTile: TileData | undefined = state.tiles[y] && state.tiles[y][x];
          if (existingTile) {
            newTable[y].push(existingTile);
          } else {
            newTable[y].push(new TileData(x, y));
          }
        }
      }

      state.tiles = newTable;
      state.stepHistory.push(newTable);
    },

    setHistoryPosition(state: TileState, position: number) {
      state.tiles = _.cloneDeep(state.stepHistory[position]);
      state.currentHistoryPosition = position;
    },

    clearHistory(state: TileState) {
      state.stepHistory = [];
      state.currentHistoryPosition = 0;
    }
  },

  actions: {
    initializeGrid(context: TileContext) {
      resize(context, {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
      });
    }
  }
};

const { commit, read, dispatch } = getStoreAccessors<TileState, AppState>("tiles");

const getters = TileConfiguration.getters;

export const getTile = read(getters.getTile);
export const getTileByCoordinate = read(getters.getTileByCoordinate);
export const getTiles = read(getters.getTiles);
export const getWidth = read(getters.getWidth);
export const getHeight = read(getters.getHeight);
export const getHistoryPosition = read(getters.getHistoryPosition);
export const getHistoryLength = read(getters.getHistoryLength);
export const getHistoryState = read(getters.getHistoryState);

const mutations = TileConfiguration.mutations;

export const updateTile = commit(mutations.updateTile);
export const updateTiles = commit(mutations.updateTiles);
export const resize = commit(mutations.resize);
export const setHistoryPosition = commit(mutations.setHistoryPosition);
export const clearHistory = commit(mutations.clearHistory);

const actions = TileConfiguration.actions;

export const initializeGrid = dispatch(actions.initializeGrid);
