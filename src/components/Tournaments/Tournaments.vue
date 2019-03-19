<template>
  <div data-app>
    <v-toolbar flat color="white">
      <v-toolbar-title>Tournaments</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">Add Tournament</v-btn>
        </template>
        
        <v-card>
          <v-form class="px-3" ref="form">
            <v-card-title  style="background-color: #1e88e5;">
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="Name*" v-model="addTournament.tname" :rules="inputRules"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="Description*"
                      v-model="addTournament.tdesc"
                      :rules="inputRules"
                      maxlength="50"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 v-if="!showPreview">
                    <div class="custom-file">
                      <input
                        type="file"
                        class="custom-file-input"
                        id="customFile"
                        accept="image/*"
                        ref="file"
                        @change="onFileChanged"
                      >
                      <label class="custom-file-label" for="customFile">Choose file</label>
                    </div>
                  </v-flex>
                  <v-flex v-show="showPreview">
                    <center>
                      <img v-bind:src="imagePreview" class="img-css">
                      <i class="fa fa-times" aria-hidden="true" @click="cancelImage"></i>
                    </center>
                  </v-flex>
                </v-layout>
              </v-container>
              <small>*Indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click="saveData">Save</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <!-- Display Data -->
    <v-data-table 
          must-sort
          :headers="headers" 
          :items="tournaments" 
          :total-items="totalTournaments"
          :pagination.sync="pagination"
          :rows-per-page-items="[5, 10, 25, {'text':'All','value':this.totalTournaments}]" 
          :disable-page-reset="true"
          class="elevation-1"
    >
      <template v-slot:items="props">
       
        <td>
          <img
            v-bind:src="'http://192.168.200.147:8087/images/thumbnail/'+props.item.tournamentBanner"
          >
        </td>
        <td>{{ props.item.tournamentName }}</td>
        <td>{{ props.item.tournamentDescription }}</td>
        <td><v-btn color="primary" dark @click="openDialog2(props.item)">Teams</v-btn></td>
        <td class="justify-center">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small @click="deleteItem(props.item.id, props.item.tournamentName)">delete</v-icon>

          <v-dialog v-model="showModal" persistent max-width="290">
            
            <v-card>
              <v-card-title class="headline">Confirm Delete?</v-card-title>
              <v-card-text>Are you sure you want to delete {{ deleteTournamentName }} Tournament?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat @click="showModal = false">No</v-btn>
                <v-btn color="green darken-1" flat @click="deleteTournament">Yes</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        
        
        
        <!-- Add Tournament Teams Module Dialog -->
        <v-dialog v-model="dialog2" max-width="500px">
          <v-card>
            <v-card-title style="background-color: #1e88e5; color: white;">
              {{ tournament_title }}
            </v-card-title>
            <v-card-text>
              <v-btn 
                  @click="addTeams"
                  dark
                  color="primary" 
              >
              Add More Teams
              </v-btn>

              <h3><u>Teams in {{ tournament_title }}</u></h3>
              <div 
                  v-if="tournamentTeam.length <= 0"
              >
                No Teams found in this Tournament!!!
              </div>

              <div v-else v-for="(tteam,id) in teams" :key="id">
                  <v-checkbox
                      :label="tteam.teamName"
                      :value="tteam.teamName"                        
                      hide-details
                  />                    
              </div>

                <!-- <div v-if="showDel">
                  <a class="btn btn-danger" href="#">
                    <i class="fa fa-trash-o fa-lg"></i> Delete
                  </a>
                </div> -->
              
            </v-card-text>
            <v-card-actions>
              <v-btn color="blue" flat @click="clearDialog2">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
        <!-- Add More Tournament Teams -->
        <v-dialog v-model="dialog3" max-width="500px">

          <v-card>
            <v-card-title>
              <span class="headlineTeam">Add Team</span>
            </v-card-title>
              
              <v-flex xs12 style="margin-left: 20px;">
                <div v-for="(team,id) in teamsToAdd" :key="id">
                  <v-checkbox
                      :label="team.teamName"
                      :value="team.teamName"                        
                      hide-details
                  />                    
                </div>
              </v-flex>
              
            <v-card-actions>
              <v-btn color="blue" flat @click="dialog3=false">Close</v-btn>
              <v-btn color="blue" flat @click="dialog3=false">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
       
        </td>
      </template>
      <!-- <template v-slot:no-data>
        <v-btn color="primary" @click="fetchTournaments">Reset</v-btn>
      </template> -->
    </v-data-table>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  
  data: () => ({
    dialog: false,
    showModal: false,
    headers: [
      {
        text: "Banner",
        align: "left",
        sortable: false,
        value: "tournamentBanner"
      },
      { text: "Name", value: "tournamentName" },
      { text: "Description", value: "tournamentDescription" },
      { text: "Teams", value: "teams", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
    addTournament: {
      tbanner: "",
      tname: "",
      tdesc: ""
    },
    pagination: {},
    editedIndex: -1,
    showPreview: false,
    imagePreview: "",
    file: "",
    inputRules: [v => !!v || 'This Field is required'],
    deletedId: -1,
    deleteTournamentName: '',

    dialog2: false,
    dialog3: false,
    showDel: false,
    totalTeams: [],
    tournament_title: '',
    teamsToAdd: [],
    teams: []
  }),

  created() {
    this.pagination.sortBy = 'id';
    this.pagination.descending = true;
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Tournament" : "Edit Tournament";
    },
    totalTournaments() {
      return +this.$store.state.TournamentStore.totalTournaments;
    },
    tournaments() {
      return this.$store.state.TournamentStore.tournaments;
    },
    allTeams() {
      return this.$store.state.TeamStore.allTeams;
    },
    tournamentTeam() {
      return this.$store.state.TournamentTeamStore.tournamentTeam;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    pagination: {
      handler() {
        let payload = {
          offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          limit: this.pagination.rowsPerPage,
          column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
          direction: this.pagination.descending ? 'desc' : 'asc'
        }
        this.$store.dispatch('getAllTournament', payload);
      },
      deep: true
    },
    tournamentTeam: {
      handler(value) {
        this.teams = this.tournamentTeam.length ? this.tournamentTeam.filter((team) => {
          return !team.TournamentTeam.isDelete;
        }) : [];
      }
    }
  },

  methods: {
    
    cancelImage() {
      this.imagePreview = "";
      this.addTournament.tbanner = "defaultTournament.png";
      this.showPreview = !this.showPreview;
    },

    onFileChanged(event) {
      this.addTournament.tbanner = event.target.files[0];

      this.file = this.$refs.file.files[0];

      let reader = new FileReader();

      reader.addEventListener(
        "load",
        function() {
          this.showPreview = true;
          this.imagePreview = reader.result;
        }.bind(this),
        false
      );

      if (this.file) {
        if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
          reader.readAsDataURL(this.file);
        }
      }
    },

    editItem(item) {
      
      this.dialog = true;

      this.addTournament.tname = item.tournamentName;
      this.addTournament.tdesc = item.tournamentDescription;

      if(item.tournamentBanner !== 'defaultTournament.png') {
          this.addTournament.tbanner = item.tournamentBanner;
          this.imagePreview ="http://192.168.200.147:8087/images/thumbnail/"+item.tournamentBanner;
          this.showPreview = true;
      }
      else {
            this.showPreview = false;
            this.addTournament.tbanner = "defaultTournament.png";
      }
      
      this.editedIndex = item.id;
    },

    deleteItem(index, name) {
      this.deletedId = index;
      this.deleteTournamentName = name;
      this.showModal = true;
    },

    deleteTournament() {
      let index = this.deletedId;

      this.$store.dispatch('deleteTournament',{ 
        index,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
        limit: this.pagination.rowsPerPage,
        column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
        direction: this.pagination.descending ? 'desc' : 'asc'
      })
      this.showModal = false;
    },

    close() {
      this.clearControls();
      this.dialog = false;
      this.editedIndex = -1;
      //this.$refs.form.reset();
    },

    saveData() {

      //for Edit
      if (this.editedIndex > -1) {

        if (this.$refs.form.validate()) {
          const formData = new FormData();
          formData.append("tournamentBanner", this.addTournament.tbanner);
          formData.append("tournamentName", this.addTournament.tname);
          formData.append("tournamentDescription", this.addTournament.tdesc);

          const config = {
            headers: {
              "content-type": "multipart/form-data"
            }
          };
          
          let index = this.editedIndex;
          this.$store.dispatch('editTournament', {
            index,
            formData,
            config,
            offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
            limit: this.pagination.rowsPerPage,
            column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
            direction: this.pagination.descending ? 'desc' : 'asc'
          })
        }
      } 
      //To add new Tournament
      else {
        if (this.$refs.form.validate()) {
          const formData = new FormData();
          formData.append("tournamentBanner", this.addTournament.tbanner);
          formData.append("tournamentName", this.addTournament.tname);
          formData.append("tournamentDescription", this.addTournament.tdesc);

          const config = {
            headers: {
              "content-type": "multipart/form-data"
            }
          };

          this.$store.dispatch('addTournament', {
            formData, 
            config,
            offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
            limit: this.pagination.rowsPerPage,
            column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
            direction: this.pagination.descending ? 'desc' : 'asc'
          })
          
        }
      }
      this.close();
      this.$refs.form.reset();
    },

    clearControls() {
      this.addTournament.tbanner = '';
      this.addTournament.tname = '';
      this.addTournament.tdesc = '';
      this.imagePreview = '';
      this.showPreview = false;
    },

    openDialog2(data) {

      this.dialog2 = true;
      this.tournament_title = data.tournamentName;
      this.$store.commit('setTournamentTeam', data.Teams);
      this.$store.dispatch('getAllTeams');
    },

    clearDialog2() {
      this.dialog2 = false;
      this.showDel = false;
    },

    selectTeam() {
      this.showDel = true;
    },

    addTeams() {
      this.dialog3 = !this.dialog3;
      this.$store.dispatch('getAllTeams');
      this.teamsToAdd = _.differenceBy(this.allTeams, this.teams, 'id' );
      console.log(this.teamsToAdd);
    }
  }
};
</script>

<style scoped>
.img-css {
  height: 100px;
  width: 100px;
}

/* .v-datatable__actions__select {
  display: none;
}

.v-datatable__actions__range-controls 
{
  display: none;
} */

h3 {
  color: cornflowerblue;
  font-variant: small-caps;
  font-weight: 600;
}

.headlineTeam {
  color: cornflowerblue;
  font-size: x-large;
}
</style>
