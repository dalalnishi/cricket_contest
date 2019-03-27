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

        <v-card height="550px">
          <v-card-title style="background-color: #1e88e5;">
            <span class="headline">Add Tournament Team Players</span>
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
              label="Select Tournament"
              solo
            ></v-select>
            <div v-if="tourId">
              <v-select
                v-if="tournamentTeam.length"
                v-model="teamId"
                :items="tournamentTeam"
                item-text="teamName"
                item-value="id"
                @change="fetchPlayers"
                attach
                chips
                label="Select Team"
                solo
              ></v-select>
              <div v-else>
                <v-select label="No Teams found in this Tournament!!!" attach disabled></v-select>
              </div>
            </div>

            <div v-if="teamId">
              
              <v-select
                v-model="playerIds"
                :items="plid"
                item-text="name"
                item-value="id"
                attach
                chips
                deletable-chips
                label="Select Players"
                multiple
              ></v-select>
            </div>
          </v-card-text>

          <v-card-actions style="justify-content: flex-end;">
            <v-btn color="blue" flat @click="close">Close</v-btn>
            <v-btn color="blue" flat @click="addPlayer">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogshow" max-width="500px">
        <!-- <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">Players Team Wise</v-btn>
        </template> -->

        <v-card height="550px">
          <v-card-title style="background-color: #1e88e5;">
            <span class="headline">Players Team Wise</span>
          </v-card-title>

          <v-card-text>
            
            <div>
              World !!            
            </div>

            <div>              
              Hello
            </div>
          </v-card-text>

          <v-card-actions style="justify-content: flex-end;">
            <v-btn color="blue" flat @click="dialogshow=false">Close</v-btn>
            <v-btn color="blue" flat @click="dialogshow=false">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="tourTeamPlayers"
      hide-actions
      :pagination.sync="pagination"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>
          <img :src="imagePath+props.item.tournamentBanner">
        </td>
        <td>{{ props.item.tournamentName }}</td>
        <td>
          <v-btn color="primary" dark @click="dialogshow=true">Show Teams</v-btn>
        </td>
      </template>
    </v-data-table>

    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      search: "",
      pagination: {},
      selected: [],
      dialog: false,
      headers: [
        {
          text: "Banner",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Tournament", value: "tournamentName" },
        { text: "Team", value: "teams", sortable: false }
      ],
      tourId: "",
      teamId: "",
      playerIds: [],
      playerOption: [],
      selectedPlayer: [],
      teamPlayersOption: [],
      plid: [],
      // selectPlayerRule: [ v => !!v || 'Please Select atleast one Player...' ]
      dialogshow: false
    };
  },

  mounted() {
    this.$store.dispatch('getTournamentTeamPlayers', {
      offset: 0,
      limit: 100,
      column: 'id',
      direction: 'desc'
    })
  },

  computed: {
    imagePath() {
      return this.$store.state.AppStore.imagePath;
    },

    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) {
        return 0;
      } else {
        let payload = {
          offset: 0,
          limit: 100,
          column: "id",
          direction: "desc"
        };
        //this.$store.dispatch("getTournamentTeamPlayers", payload);
        return Math.ceil(
          this.pagination.totalItems / this.pagination.rowsPerPage
        );
      }
    },

    tourTeamPlayers() {
      return this.$store.state.TourTeamPlayer.tourTeamPlayers;
    },

    tournamentTeam() {
      return this.$store.state.TournamentTeamStore.tournamentTeam;
    },

    Tourplayers() {
      return this.$store.state.TourTeamPlayer.allPlayers;
    }
  },

  methods: {
    fetchTeam() {
      this.$store.dispatch("getTournamentById", this.tourId);
    },

    fetchPlayers() {

      this.$store.dispatch("getAllTourPlayers", {
          offset: 0,
          limit: 100,
          column: "id",
          direction: "desc"
        })
        .then(res => {
          
          this.playerOption = this.tourTeamPlayers.length ? this.tourTeamPlayers.filter(tplayer => {
                return tplayer.id === this.tourId;
          }) : [];

          if (this.playerOption[0]) {
            this.selectedPlayer = this.playerOption[0].Players.map(mplayer => {
              if (mplayer.TeamPlayer) {
                if (mplayer.TeamPlayer.isDelete === 0) {
                  return mplayer.id;
                }
              }
              return "";
            });
          }

          this.plid = [];
          this.Tourplayers.map(x => {
            if(!this.selectedPlayer.includes(x.id))
            {
                this.plid.push({
                  id: x.id,
                  name: x.firstName + " " + x.lastName
                })
            }  
          });
          return this.plid;          
        });
    },

    addPlayer() {
      
      if(this.playerIds != '') {
        
        this.$store.dispatch("addPlayersTourTeam", {
          tournamentId: this.tourId,
          teamId: this.teamId,
          selectedPlayers: this.playerIds
        })
        .then(() => {
          
          this.dialog = false;
          this.playerIds = [];
          this.tourId = "";
          this.teamId = "";
        })
      }    
    },

    close() {
      this.dialog = false;
      this.tourId = "";
    }
  }
};
</script>