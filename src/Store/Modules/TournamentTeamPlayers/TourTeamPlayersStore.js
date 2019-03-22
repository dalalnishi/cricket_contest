import axios from 'axios';

const state = {
    tourTeamPlayers: []
}

const actions = {
    getTournamentTeamPlayers({commit}, { offset, limit, column, direction }) {
        axios
            .get('api/tournament/' + offset + '/' + limit + '/' + column + '/' + direction )
            .then(response => {
                commit('setTeamPlayers', response.data)
            })
            .catch(error => {
                console.log(error.response.data.error);
            })
    },

    // teamById({commit}, index) {
    //     axios   
    //         .get('api/team/' + index)
    //         .then(response => {
    //             console.log(response.data);
    //         })
    //         .catch(error => {
    //             console.log(error.response.data.error)
    //         })
    // }
}

const mutations = {
    setTeamPlayers( state, data ) {
        state.tourTeamPlayers = data;
    }
}

const getters = {

}

export default {
    state, actions, mutations, getters
}