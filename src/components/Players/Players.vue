<template>
  <div data-app>
    <v-toolbar flat color="white">
      <v-toolbar-title >Players</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Player</v-btn>
        </template>
        <v-card>
           <v-form class="px-3" ref="form">
          <v-card-title style="background-color: #1e88e5;">
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field 
                      v-model="addPlayer.firstName" 
                      label="First name"
                      :rules="inputRules"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field 
                      v-model="addPlayer.lastName" 
                      label="Last name"
                      :rules="inputRules"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="20"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template slot="activator">
                    <v-text-field
                            v-model="addPlayer.dob"
                            label="Date of Birth"
                            prepend-icon="fa fa-calendar"
                            :rules = "dateRules"
                            readonly
                    ></v-text-field>
                    </template>
                    <v-date-picker 
                        color="green lighten-1" 
                        header-color="blue" 
                        v-model="addPlayer.dob" 
                        @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md12>
                  <v-radio-group
                      label="Gender"    
                      v-model="addPlayer.gender"                   
                      row>
                    <v-radio color="#4caf50" label="Male" value="1"></v-radio>
                    <v-radio color="#4caf50" label="Female" value="2" ></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-flex xs12>
                  <v-text-field 
                      v-model="addPlayer.description" 
                      label="Description"
                      :rules="inputRules"
                      maxlength="50"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <div class="custom-file" v-if="!showPreview">
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
                <v-flex xs12 v-show="showPreview">
                    <center>
                      <img :src="imagePreview" class="img-css" />
                      <i class="fa fa-times" aria-hidden="true" @click="cancelImage" />
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
      must-sort
      :headers="headers"
      :items="players"
      :total-items="totalPlayers"
      :pagination.sync="pagination"
      :rows-per-page-items="[5, 10, 25, {'text':'All','value':this.totalPlayers}]" 
      :disable-page-reset="true"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td><img :src="imagePath+props.item.playerImage" alt="" /></td>
        <td>{{ props.item.firstName + ' ' + props.item.lastName }}</td>
        <td>{{calcAge(props.item.dob)}}</td>
        <td>{{ props.item.gender ===1 ? 'Male' : 'Female' }}</td>
        <td>{{ props.item.description }}</td>        
        <td>
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item.id, props.item.firstName)"
          >
            delete
          </v-icon>
          <v-dialog v-model="showModal" persistent max-width="290">
            
            <v-card>
              <v-card-title class="headline">Confirm Delete?</v-card-title>
              <v-card-text>Are you sure you want to delete {{ deletePlayerName }} Player?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat @click="showModal = false">No</v-btn>
                <v-btn color="green darken-1" flat @click="deletePlayer">Yes</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
      </template>
      <!-- <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template> -->
    </v-data-table>
  </div>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'Avatar',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Name', value: 'firstName' },
        { text: 'Age', value: 'dob' },
        { text: 'Gender', value: 'gender' },
        { text: 'Description', value: 'description', sortable: false },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      pagination: {},
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      menu2: false,
      addPlayer: {
        firstName: '',
        lastName: '',
        dob: '',
        gender: '1',
        description: '',
        playerImage: ''
      },
      file: '',
      showPreview: false,
      imagePreview: '',
      inputRules: [
        v => !!v || 'This Field is required'
      ],
      dateRules: [
        v => !!v || 'Date Of Birth is required'
      ],
      deletePlayerName: '',
      deleteIndex: -1,
      showModal: false
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Player' : 'Edit Player'
      },
      players() {
        return this.$store.state.PlayerStore.players;
      },
      totalPlayers() {
        return +this.$store.state.PlayerStore.playerLength;
      },
      imagePath() {
        return this.$store.state.AppStore.imagePath;
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      pagination: {
        handler() {
          let payload = {
            offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
            limit: this.pagination.rowsPerPage,
            column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
            direction: this.pagination.descending ? 'desc' : 'asc'
          }
          this.$store.dispatch('getAllPlayers', payload);
        },
        deep: true
      }
    },

    created () {
      this.pagination.sortBy = 'id';
      this.pagination.descending = true;
    },

    methods: {

      onFileChanged(event) {
        this.addPlayer.playerImage = event.target.files[0];
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

        if(this.file) 
        {
            if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
              reader.readAsDataURL(this.file);
            }
        }
      },

      cancelImage() {
        this.showPreview = !this.showPreview;
        this.imagePreview = '';
        this.addPlayer.playerImage = 'defaultPlayerImage.png';
      },

      calcAge(dob) {
        
        let bdate = new Date(dob);
        let curr = new Date();
        
        let diff = curr - bdate;
        return Math.floor(diff/31557600000);
      },

      editItem (item) {
        this.editedIndex = item.id;

        this.addPlayer.firstName = item.firstName;
        this.addPlayer.lastName = item.lastName;
        this.addPlayer.dob = item.dob;
        this.addPlayer.gender = item.gender.toString();
        this.addPlayer.description = item.description;

        if(item.playerImage !== 'defaultPlayerImage.png' ) {
          this.imagePreview = this.imagePath+item.playerImage;
          this.addPlayer.playerImage = item.playerImage;
          this.showPreview = true;
        }
        else {
          this.showPreview = false;
          this.addPlayer.playerImage = 'defaultPlayerImage.png';
        }   
        this.dialog = true;
      },

      deleteItem (index, pname) {
        this.deletePlayerName = pname;
        this.deleteIndex = index;
        this.showModal = true;        
      },

      deletePlayer() {
        let index = this.deleteIndex;

        this.$store.dispatch('deletePlayer', { 
          index,
          offset: ( this.pagination.page - 1 ) * this.pagination.rowsPerPage,
          limit: this.pagination.rowsPerPage,
          column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
          direction: this.pagination.descending ? 'desc' : 'asc'
        })
      
        this.showModal = false;
      },

      close () {
        this.addPlayer.firstName = '';
        this.addPlayer.lastName = '';
        this.addPlayer.gender = '1';
        this.addPlayer.dob = '';
        this.addPlayer.description = '';
        this.imagePreview = '';
        this.showPreview = false;
        this.editedIndex = -1;
        this.dialog = false;
      },

      save () {
        if (this.editedIndex > -1) {
          
          if(this.$refs.form.validate()) {
            const formData = new FormData();
            formData.append('firstName', this.addPlayer.firstName);
            formData.append('lastName', this.addPlayer.lastName);
            formData.append('dob', this.addPlayer.dob);
            formData.append('gender', this.addPlayer.gender);
            formData.append('description', this.addPlayer.description);
            formData.append('playerImage', this.addPlayer.playerImage);

            const config = {
              headers: {
                'content-type': 'multipart/form-data'
              }
            };
            
            let editId = this.editedIndex;
            
            this.$store.dispatch('editPlayer', {
              editId,
              formData,
              config,
              offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
              limit: this.pagination.rowsPerPage,
              column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
              direction: this.pagination.descending ? 'desc' : 'asc'
            });
            this.$refs.form.reset();
            this.close();
          }
        } 
        else {
          
          if (this.$refs.form.validate()) {

            const formData = new FormData();
            formData.append('firstName', this.addPlayer.firstName);
            formData.append('lastName', this.addPlayer.lastName);
            formData.append('dob', this.addPlayer.dob);
            formData.append('gender',this.addPlayer.gender);
            formData.append('description', this.addPlayer.description);
            formData.append('playerImage', this.addPlayer.playerImage);

            const config = {
              headers: {
                'content-type' : 'multipart/form-data'
              }
            }
            this.$store.dispatch('addPlayer', {
              formData,
              config,
              offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
              limit: this.pagination.rowsPerPage,
              column: this.pagination.sortBy ? this.pagination.sortBy : 'id',
              direction: this.pagination.descending ? 'desc' : 'asc'
            })
            this.$refs.form.reset();
            this.close();
          }
      }
        
      }
    }
  }
</script>

<style scoped>
  .img-css {
    height: 100px;
    width: 100px;
  }

  .v-dialog:not(.v-dialog--fullscreen) {
    max-height: 100%;
  }
</style>
