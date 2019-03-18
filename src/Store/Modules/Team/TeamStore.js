import axios from "axios";

const state = {
    teamLength: '0',
    teams: [],
    allTeams: []
}

const actions = {
    getTeams({commit}, { offset, limit, column, direction }) {
        axios
        .get("api/team/"+ offset + '/' + limit + '/' + column + '/' + direction)
        .then(response => {
            commit('setTeamsLength', response.data.length);
            commit('setTeams', response.data);
        })
        .catch(error => {
          console.log(error.response.data.error);
        });
    },

    getAllTeams({ commit }) {
        axios
        .get("api/team/")
        .then(response => {
            console.log('teams', response.data)
            //commit('setAllTeams', response.data);
        })
        .catch(error => {
          console.log(error.response.data.error);
        });
    },

    addTeam({ dispatch }, { formData, config, offset, limit, column, direction }) {
        axios
            .post('api/team/', formData, config, )
            .then(response=> {
                if(response) {
                    dispatch('getTeams', { offset, limit, column, direction} );
                }
            })
            .catch(error =>{
                console.log(error.response.data.error);
            });
    },

    editTeam({dispatch}, { index, formData, config, offset, limit, column, direction }) {
        axios
            .put('api/team/'+index, formData, config)
            .then(response => {
              dispatch('getTeams', { offset, limit, column, direction })
            })
            .catch(error => {
              console.log(error.response.data.error);
            });
    },

    deleteTeam({ dispatch }, { index, offset, limit, column, direction }) {
        axios
            .delete("api/team/" + index)
            .then(response => {
                if (response) {
                    dispatch('getTeams', { offset, limit, column, direction })
                }
            })
            .catch(error => {
                console.log(error.response.data.error);
            });
    }
}

const mutations = {
    setTeamsLength( state, data ) {
        state.teamLength = data;
    },
    setTeams( state, data ) {
        state.teams = data;
    },
    setAllTeams( state, data ) {
        state.allTeams = data;
    }
}

const getters = {
    
}

export default 
{
    state, actions, getters, mutations
}