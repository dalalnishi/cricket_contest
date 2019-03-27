import axios from 'axios';

const state = {
    tourTeamPlayers: [],
    allPlayers: []
}

const actions = {
    getTournamentTeamPlayers({commit}, { offset, limit, column, direction }) {
        
        axios
            .get('api/tournament/'+ offset + '/' + limit + '/' + column + '/' + direction )
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
    },

    addPlayersTourTeam({dispatch}, { tournamentId, teamId, selectedPlayers }) {

        let uid = localStorage.getItem('uid');
        return axios
            .post('api/teamplayer/', { tournamentId, teamId, selectedPlayers, uid })
            .then(response => {
                dispatch('getTournamentTeamPlayers', { offset: 0, limit: 100, column: 'id', direction: 'desc' });
            })
            .catch(error => {
                console.log(error.response.data.error);
            })
    }
    
}

const mutations = {
    setTeamPlayers (state, data) {
        state.tourTeamPlayers = data;
    },

    setPlayers( state, payload ) {
        state.allPlayers = payload;
    }

}

const getters = {

}

export default {
    state, actions, mutations, getters
}