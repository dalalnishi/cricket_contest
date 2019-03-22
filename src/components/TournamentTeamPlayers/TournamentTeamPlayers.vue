<template>
  <div data-app>
      <v-toolbar flat color="white">
      <v-toolbar-title>Tournament Team Players</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">Add Team Players</v-btn>
        </template>

        <v-card height="450px">
            <v-card-title style="background-color: #1e88e5;">
              <span class="headlineTeam">Add Team</span>
            </v-card-title>
            
            <v-card-text>              
              <v-select      
                v-model="tourId"          
                :items="tourTeamPlayers"
                item-text="tournamentName"
                item-value="id"
                @change="fetchTeam"
                attach
                chips
                deletable-chips
                label="Select Tournament"
                solo
              ></v-select> 

              <v-select v-if="tourteams.length"  
                v-model="teamId" 
                :items="tourteams"
                item-text="teamName"
                item-value="id"
                @change="fetchTeam"
                attach
                chips
                deletable-chips
                label="Select Team"
                solo
              ></v-select>             
            </v-card-text>
          
            <v-card-actions style="justify-content: flex-end;">
              <v-btn color="blue" flat @click="dialog=false">Close</v-btn>
              <v-btn color="blue" flat @click="dialog=false">Add</v-btn>
            </v-card-actions>
        </v-card>    
      </v-dialog>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="tourTeamPlayers"
      :search="search"
      hide-actions
      :pagination.sync="pagination"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td><img :src="imagePath+props.item.tournamentBanner"></td>
        <td>{{ props.item.tournamentName }}</td>
        <td><v-btn color="primary" dark>Show Teams</v-btn></td>
      </template>
    </v-data-table>

    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        search: '',
        pagination: {},
        selected: [],
        dialog: false,
        items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
        headers: [
          {
            text: 'Banner',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Tournament', value: 'tournamentName' },
          { text: 'Team', value: 'teams', sortable: false }
        ],
        tourId: '',
        teamId: '',
        tourteams: []
      }
    },
    computed: {

      imagePath() {
        return this.$store.state.AppStore.imagePath;
      },

      pages () {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null ) 
        {
            return 0
        }
        else 
        {
            let payload = {
                offset: 0,
                limit: 100,
                column: 'id',
                direction: 'desc'
            }
            this.$store.dispatch('getTournamentTeamPlayers', payload);
            return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
        }
      },

      tourTeamPlayers () {
          return this.$store.state.TourTeamPlayer.tourTeamPlayers;
      }
    },
    methods: {
        fetchTeam() {
            console.log(this.tourId);
            //this.$store.dispatch('teamById', this.teamId);
            
            this.tourteams = this.tourTeamPlayers.length ? this.tourTeamPlayers.filter((team) => {                
                return team.id === this.tourId;
            }) : []
            
            console.log(this.tourteams);
        }
    }
  }
</script>