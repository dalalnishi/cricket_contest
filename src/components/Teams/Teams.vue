<template>
  <div data-app>
    <v-toolbar flat color="white">
      <v-toolbar-title>Teams</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Team</v-btn>
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
                  <v-text-field v-model="addTeam.teamname" label="Name" :rules="inputRules"></v-text-field>
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
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-form>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table 
        :headers="headers" 
        :items="teams" 
        :total-items="totalTeams"
        :pagination.sync="pagination"
        :rows-per-page-items="[5, 10, 25, {'text':'All','value':this.totalTeams}]" 
        :disable-page-reset="true"
        class="elevation-1"
    >
      <template v-slot:items="props">
        <td>
          <img :src="imagePath + props.item.teamLogo">
        </td>
        <td>{{ props.item.teamName }}</td>
        <td>
          <v-icon small @click="editItem(props.item)">edit</v-icon>
          <v-icon small @click="deleteItem(props.item.id, props.item.teamName)">delete</v-icon>

          <v-dialog v-model="showModal" persistent max-width="290">
            
            <v-card>
              <v-card-title class="headline">Confirm Delete?</v-card-title>
              <v-card-text>Are you sure you want to delete {{ deleteTeamName }} Tournament?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat @click="showModal = false">No</v-btn>
                <v-btn color="green darken-1" flat @click="deleteTeam">Yes</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    dialog: false,
    showModal: false,
    headers: [
      {
        text: "Team Logo",
        align: "left",
        sortable: false,
        value: "logo"
      },
      { text: "Team Name", value: "teamName" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    pagination: {},
    editedIndex: -1,
    addTeam: {
      teambanner: "",
      teamname: ""
    },
    showPreview: false,
    imagePreview: "",
    file: "",
    inputRules: [v => v.length >= 3 || "Please Provide valid Input..!"],
    deleteIndex: -1,
    deleteTeamName: ''
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Team" : "Edit Team";
    },
    totalTeams() {
      return +this.$store.state.TeamStore.teamLength;
    },
    teams() {
      return this.$store.state.TeamStore.teams;
    },
    imagePath() {
      return this.$store.state.AppStore.imagePath;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    pagination: {
      handler() {
        let payload = {
          offset: ( this.pagination.page - 1 ) * this.pagination.rowsPerPage,
          limit: this.pagination.rowsPerPage,
          column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
          direction: this.pagination.descending ? 'desc' : 'asc'
        }
        this.$store.dispatch('getTeams', payload);
      },
      deep: true
    }
  },

  created() {
    this.pagination.sortBy = 'id';
    this.pagination.descending = true;
  },

  methods: {
    fetchTeam() {
      axios
        .get("http://192.168.200.147:8087/api/team/0/100/id/desc")
        .then(response => {
          this.teams = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    cancelImage() {
      this.imagePreview = "";
      this.addTeam.teambanner = "defaultTeamLogo.png";
      this.showPreview = !this.showPreview;
    },

    onFileChanged(event) {
      this.addTeam.teambanner = event.target.files[0];

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
      this.editedIndex = item.id;
      this.addTeam.teamname = item.teamName;

      if( item.teamLogo !== 'defaultTeamLogo.png' ) {
        this.addTeam.teambanner = item.teamLogo;
        this.imagePreview =this.imagePath+item.teamLogo;
        this.showPreview = true;
      }
      else{
        this.showPreview = false;
        this.addTeam.teambanner = 'defaultTeamLogo.png';
      }
    },

    deleteItem(index, name) {
      this.deleteIndex = index;
      this.deleteTeamName = name;
      this.showModal = true;
    },

    deleteTeam() {
      let index = this.deleteIndex;

      this.$store.dispatch('deleteTeam', { 
        index,
        offset: ( this.pagination.page - 1 ) * this.pagination.rowsPerPage,
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
    },

    save() {
      //To edit Team
      if (this.editedIndex > -1) {
        if(this.$refs.form.validate()) {
          const formData = new FormData();
          formData.append('teamLogo', this.addTeam.teambanner);
          formData.append('teamName', this.addTeam.teamname);

          const config = {
            headers: {
              "content-type": "multipart/form-data"
            }
          };

          let index = this.editedIndex;
          this.$store.dispatch('editTeam', {
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

      //To add New Team
      else {
        if (this.$refs.form.validate()) {
          const formData = new FormData();
          formData.append("teamName", this.addTeam.teamname);
          formData.append("teamLogo", this.addTeam.teambanner);

          const config = {
            headers: {
              "content-type": "multipart/form-data"
            }
          };

          this.$store.dispatch('addTeam', { formData, config,
              offset: ( this.pagination.page - 1 ) * this.pagination.rowsPerPage,
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
      this.addTeam.teamname = '';
      this.addTeam.teambanner = '';
      this.showPreview = false;
      this.imagePreview = '';
    }
  }
};
</script>

<style scoped>
.img-css {
  height: 100px;
  width: 100px;
}
</style>
