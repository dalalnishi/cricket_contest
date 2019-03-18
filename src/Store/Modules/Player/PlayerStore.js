import axios from 'axios';

const state = {
    playerLength: '0',
    players: []
}

const actions = {
    getAllPlayers({commit}, { offset, limit, column, direction }) {
        axios
            .get('api/player/' + offset + '/' + limit + '/' + column + '/' + direction )
            .then(response => {
                //console.log(response.data)
                commit('setPlayersLength', response.data.length);
                commit('setPlayers', response.data);
            })
            .catch(error => {
                console.log(error.response.data.error)
            })
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