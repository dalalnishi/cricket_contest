import axios from "axios";
//import routes from '../routes/routes.js'

const state = {
    user: {
        token: '',
        uid: ''
    },
    error_msg: ''
}

const actions = {
    LogAction({commit}, user) {        
        return axios
            .post("auth/login", user)
            .then(response => {
              if (response) {
                localStorage.setItem("token", response.data.user.token);
                localStorage.setItem("uid", response.data.user.id);
                
                commit('LogUser', { token: response.data.user.token, uid: response.data.user.id });
              }
            })
            .catch(error => {
              commit('Log_fail', error.response.data.error);
            });
    },

    clearAuth({commit}) {
        commit('removeState');
        localStorage.clear();
    },

    registerUser({ commit }, registerData) {

        // console.log('data',registerData);
        return axios
            .post('auth/signup', registerData)
            .then(response => {
                if(response) {
                    return true;
                }
            })
            .catch(error => {
                return false;
            })
    }
}

const mutations = {
    LogUser( state, { token, uid } ) {
        state.user.token = token;
        state.user.uid = uid;             
    },

    Log_fail(state, payload) {
        state.error_msg = payload;
    },

    removeState(state) {
        state.user.token = null;
        state.user.uid = null;
    }
}

const getters = {
    login_error(state) {
        return state.error_msg;
    }
}

export default {
    state, actions, getters, mutations
}