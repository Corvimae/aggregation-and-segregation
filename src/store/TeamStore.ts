import { Store, StoreOptions, ActionContext } from "vuex";
import { getStoreAccessors } from "vuex-typescript";
import { AppState } from "store/AppStore";
import { Team } from "data/Team";
import * as _ from "lodash"
import Vue from "vue";

export interface TeamState {
  teams: Team[];
  nextHighestId: number;
}

type TeamContext = ActionContext<TeamState, AppState>;

export const TeamConfiguration = {
  namespaced: true,

  state: {
    teams: [],
    nextHighestId: 0
  },

  getters: {
    getTeams(state: TeamState) {
      return state.teams.map(_.cloneDeep);
    },

    getTeamById(state: TeamState) {
      return (id: number) => _.cloneDeep(_.find(state.teams, team => team.id === id));
    }
  },

  mutations: {
    addTeam(state: TeamState) {
      state.teams.push(new Team(state.nextHighestId++));
    },

    removeTeam(state: TeamState, team: Team) {
      let matchIndex = -1;
      
      state.teams.forEach((listingTeam, index) => {
        if(team.id === listingTeam.id) {
          matchIndex = index;
        }
      });

      if(matchIndex !== -1) {
        state.teams.splice(matchIndex, 1);
      }
    },

    updateTeam(state: TeamState, teamToUpdate: Team) {
      state.teams.forEach((team, index) => {
        if (team.id === teamToUpdate.id) {
          Vue.set(state.teams, index, teamToUpdate);
        }
      });
    }
  }
};

const { commit, read, dispatch } = getStoreAccessors<TeamState, AppState>("teams");

const getters = TeamConfiguration.getters;

export const getTeamById = read(getters.getTeamById);
export const getTeams = read(getters.getTeams);

const mutations = TeamConfiguration.mutations;

export const addTeam = commit(mutations.addTeam);
export const removeTeam = commit(mutations.removeTeam);
export const updateTeam = commit(mutations.updateTeam);
