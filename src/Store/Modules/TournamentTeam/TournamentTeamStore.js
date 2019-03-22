import axios from 'axios';

const state = {
    tournamentTeam: []
}

const actions = {
    addTournamentTeam({dispatch}, { tournamentId, teamId, offset, limit, column, direction }) {
        teamId.forEach(id => {
            axios 
                .post('api/tournamentteam/', { tournamentId: tournamentId, teamId: id })
                .then(response => {

                    if (teamId.indexOf(id) === (teamId.length - 1)) {
                        //To Display updated Teams of Tournament after adding new Teams
                        dispatch('getTournamentById', tournamentId);

                        //To Display updated Tournaments on Tournament Page
                        dispatch('getAllTournament', { offset, limit, column, direction })
                    }
                })
                .catch(error => {
                    console.log(error.response.data.error);
                })
        })
        
    },

    deleteTournamentTeam({dispatch}, { tournamentId, teamId, offset, limit, column, direction }) {
        teamId.forEach(id => {
            
            let uid = localStorage.getItem('uid');
            
            axios 
                .delete('api/tournamentteam/' + tournamentId + '/' + id + '/' + uid)
                .then(response => {
                    
                    if (teamId.indexOf(id) === (teamId.length - 1)) {
                        //To Display updated Teams of Tournament after deleting Teams
                        dispatch('getTournamentById', tournamentId);

                        //To Display updated Tournaments on Tournament Page
                        dispatch('getAllTournament', { offset, limit, column, direction })
                    }
                })
                .catch(error => {
                    console.log(error.response.data.error)
                })
        })
    }
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