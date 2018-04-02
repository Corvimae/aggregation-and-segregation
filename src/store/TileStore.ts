import { Store, StoreOptions, ActionContext } from "vuex";
import { getStoreAccessors } from "vuex-typescript";
import { AppState } from "store/AppStore";
import TileData from "data/TileData";
import Vue from "vue";
import * as _ from "lodash";
import { Coordinate } from "utils/MoveSimulator";

const DEFAULT_WIDTH = 25;
const DEFAULT_HEIGHT = DEFAULT_WIDTH;

export interface TileState {
  tiles: TileData[],
  width: number,
  height: number
};

type TileContext = ActionContext<TileState, AppState>;

const findByCoordinates = (x: number, y: number) => (tile: TileData) => tile.y === y && tile.x === x;
const doTilesMatchCoordinates = (a: TileData, b: TileData) => a.x === b.x && a.y === b.y;

const updateTileSet = (state: TileState, tilesToUpdate: TileData[]) => {
  _.difference(tilesToUpdate, state.tiles).forEach(tile => {
    const index = _.findIndex(state.tiles, findByCoordinates(tile.x, tile.y));
    if (index > -1) {
      Vue.set(state.tiles, index, tile);
    } else {
      state.tiles.push(tile);
    }
  });
}

export const TileConfiguration = {
  namespaced: true,

  state: {
    tiles: [],
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },

  getters: {
    getTiles(state: TileState) {
      return state.tiles.map(_.cloneDeep);
    },

    getTile(state: TileState) {
      return (x: number, y: number) => _.cloneDeep(_.find(state.tiles, findByCoordinates(x, y)));
    },

    getTileByCoordinate(state: TileState) {
      return (coord: Coordinate) => _.cloneDeep(_.find(state.tiles, findByCoordinates(coord.x, coord.y)));
    },

    getWidth(state: TileState) {
      return state.width;
    },

    getHeight(state: TileState) {
      return state.height;
    }
  },

  mutations: {
    updateTile(state: TileState, tileToUpdate: TileData) {
      const index = _.findIndex(state.tiles, findByCoordinates(tileToUpdate.x, tileToUpdate.y));

      if (!_.isEqual(state.tiles[index], tileToUpdate)) {
        Vue.set(state.tiles, index, tileToUpdate);
      }
    },

    updateTiles(state: TileState, tilesToUpdate: TileData[]) {
      state.tiles = tilesToUpdate;

      //updateTileSet(state, tilesToUpdate);
    },

    resize(state: TileState, payload: { width: number, height: number }) {
      state.width = payload.width;
      state.height = payload.height;

      // Create a new "blank" table.
      let newTable: TileData[] = [];

      for (let y: number = 0; y < payload.height; y++) {
        for (let x: number = 0; x < payload.width; x++) {
          newTable.push(new TileData(x, y));
        }
      }

      newTable = _.unionWith(state.tiles, newTable, );

      // Remove all elements outside the dimensions.
      _.remove(newTable, tile => tile.x > payload.width || tile.y > payload.height);

      state.tiles = newTable;

      //updateTileSet(state, _.difference(newTable, state.tiles));
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

const mutations = TileConfiguration.mutations;

export const updateTile = commit(mutations.updateTile);
export const updateTiles = commit(mutations.updateTiles);
export const resize = commit(mutations.resize);

const actions = TileConfiguration.actions;

export const initializeGrid = dispatch(actions.initializeGrid);
