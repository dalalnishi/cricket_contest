import Vue from 'vue'
import Vuex from 'vuex'

import LoginStore from './Modules/User/LoginStore.js'
import TournamentStore from './Modules/Tournament/TournamentStore.js'
import TeamStore from './Modules/Team/TeamStore.js'
import PlayerStore from './Modules/Player/PlayerStore.js'
import TournamentTeamStore from './Modules/TournamentTeam/TournamentTeamStore.js'

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: { LoginStore, TournamentStore, TeamStore, PlayerStore, TournamentTeamStore }
});