import axios from 'axios';

const state = {
    tourTeamPlayers: [],
    allPlayers: []
}

const actions = {
    getTournamentTeamPlayers({commit}, { offset, limit, column, direction }) {
        axios
            .get('api/tournament/' + offset + '/' + limit + '/' + column + '/' + direction )
            .then(response => {
                commit('setTeamPlayers', response.data);
            })
            .catch(error => {
                console.log(error.response.data.error);
            })
    },
    getAllTourPlayers({commit}, { offset, limit, column, direction }) {
        return axios
            .get('api/player/'+ offset + '/' + limit + '/' + column + '/' + direction )
            .then(response => {
                commit('setPlayers', response.data);
            })
            .catch(error => {
                console.log(error.response.data.error)
            })
    }
    
}

const mutations = {
    setTeamPlayers (state, data) {
        state.tourTeamPlayers = data;
    },
    setPlayers( state, payload ) {
        state.allPlayers = payload;
        console.log('state',state.allPlayers);
    }

}

const getters = {

}

export default {
    state, actions, mutations, getters
}