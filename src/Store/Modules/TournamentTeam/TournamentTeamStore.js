import axios from 'axios';

const state = {
    tournamentTeam: []
}

const actions = {
    
}   

const getters = {
    
}

const mutations = {
    setTournamentTeam( state, payload ) {
        state.tournamentTeam = payload;
    }
}

export default {
    state, actions, getters, mutations
}