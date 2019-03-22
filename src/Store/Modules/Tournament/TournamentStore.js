import axios from 'axios';

const state = {
    tournaments: [],
    totalTournaments: 0
}

const actions = {
    getAllTournament({commit}, { offset, limit, column, direction }) {
        return axios
            .get('api/tournament/'+ offset + '/' + limit + '/' + column + '/' + direction)
            .then(response=> {
               
                commit('setTournamentLength', response.data.length);
                commit('setTournament', response.data);
        })
        .catch(error => {
            return error;
        })
    },

    addTournament({dispatch}, { formData, config, offset, limit, column, direction }) {
        axios
            .post("api/tournament/", formData, config)
            .then(response => {
                dispatch('getAllTournament', { offset, limit, column, direction })
            })
            .catch(error => {
                console.log(error.response.data.error);
            });
    },

    editTournament({dispatch},{ index, formData, config, offset, limit, column, direction }) {
        axios
            .put("api/tournament/" + index, formData, config)
            .then(response => {
                dispatch('getAllTournament', { offset, limit, column, direction })
            })
            .catch(error => {
              console.log(error.response.data.error);
            });
    },

    deleteTournament({dispatch}, { index, offset, limit, column, direction }) {
        axios
            .delete("api/tournament/" + index)
            .then(response => {
                dispatch('getAllTournament', { offset, limit, column, direction });
            })
            .catch(error => {
                console.log(error.response.data.error);
            });
    },

    getTournamentById({commit}, tournamentId) {
        axios
            .get('api/tournament/'+ tournamentId)
            .then(response => {
                commit('setTournamentTeam', response.data.Teams);
            })
            .catch(error => {
                console.log(error.response.data.error);
            })
    }
}

const mutations = {
    setTournamentLength( state, data ) {
        state.totalTournaments = data;
    },
    setTournament( state, data ) {
        state.tournaments = data;
    }
}

const getters = {

}


export default {
    state, getters, actions, mutations
}