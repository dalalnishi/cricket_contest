import axios from 'axios';

const state = {
    playerLength: '0',
    players: []
}

const actions = {
    getAllPlayers({commit}, { offset, limit, column, direction }) {
        axios
            .get('api/player/'+ offset + '/' + limit + '/' + column + '/' + direction )
            .then(response => {
                commit('setPlayersLength', response.data.length);
                commit('setPlayers', response.data);
            })
            .catch(error => {
                console.log(error.response.data.error)
            })
    },
    addPlayer({dispatch}, { formData, config, offset, limit, column, direction }) {
        axios
            .post('api/player/', formData, config)
            .then(response => {
                dispatch('getAllPlayers', { offset, limit, column, direction })
            })
            .catch(error => {
                console.log(error.response.data.error);
            })
    },

    deletePlayer({dispatch}, { index, offset, limit, column, direction }) {
        axios
            .delete('api/player/'+index)
            .then(response => {
                dispatch('getAllPlayers', { offset, limit, column, direction })
            })
            .catch(error => {
                console.log(error.response.data.error)
            });
    },

    editPlayer({dispatch}, { editId, formData, config, offset, limit, column, direction }) {
        
        axios
            .put('api/player/'+editId, formData, config)
            .then(response => {
              dispatch('getAllPlayers', { offset, limit, column, direction })
            })
            .catch(error => {
              console.log(error.response.data.error);
            });
    }
}

const mutations = {
    setPlayersLength( state, payload ) {
        state.playerLength = payload;
    },
    setPlayers( state, payload ) {
        state.players = payload;
    }
}

const getters = {

}

export default {
    state, actions, mutations, getters
}