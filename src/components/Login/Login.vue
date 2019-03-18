<template>
  <div class="container">
    <div class="alert alert-danger" v-if="$store.getters.login_error!=''">{{ $store.getters.login_error }}</div>
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Sign In</h5>              
              <v-form ref="form" v-model="valid">
                <v-text-field v-model="email" label="Email" :rules="emailRules" required></v-text-field>
                <v-text-field v-model="password" label="Password" type="password" :rules="passRules" required></v-text-field>
                <v-btn color="blue darken-1" flat @click="loginUser" style="float: right;">Login</v-btn>
              </v-form>
              <br/><br/><br/>
              <center>New Here? <a href="/registration">Sign Up</a></center>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      email: "",
      password: "",
      msg: "",
      valid: false,
      emailRules: [
        v => !!v || "<p style='color:red; font-size:12px;'>E-mail is required</p>",
        v => /.+@.+/.test(v) || "<p style='color:red; font-size:12px;'>E-mail must be valid</p>"
      ],
      passRules: [
        v => !!v || "<p style='color:red; font-size:12px;'>Password is required</p>",
      ]
    };
  },

  computed: {
      ...mapGetters([
        'login_error'
      ])
  },

  methods: {
    redirectRegi: function() {
      this.$router.push("/registration");
    },

    loginUser: function() {

      if (this.$refs.form.validate()) {
        const user = {
          email: this.email,
          password: this.password
        };
        
        return this.$store.dispatch('LogAction', user).then(()=> {
          this.$router.push('/dashboard');
        });
    }
  },

  beforeRouteEnter(to, from, next) {
    if (localStorage.token) {
      next("/dashboard");
    }
    next();
  }

  }
};
</script>

<style scoped>
.form-label-group {
  color: #333;
  float: left;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 13px;
  line-height: 20px;
  margin: 0 3px 10px;
  width: 100%;
}

:root {
  --input-padding-x: 1.5rem;
  --input-padding-y: 0.75rem;
}

.card-signin {
  border: 0;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1);
}

.card-signin .card-title {
  margin-bottom: 2rem;
  font-weight: 300;
  font-size: 1.5rem;
}

.card-signin .card-body {
  padding: 2rem;
}

.form-signin {
  width: 100%;
}

.form-label-group {
  position: relative;
  margin-bottom: 1rem;
}

.form-label-group > input,
.form-label-group > label {
  padding: var(--input-padding-y) var(--input-padding-x);
}

.form-label-group > label {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  margin-bottom: 0;
  /* Override default `<label>` margin */
  line-height: 1.5;
  color: #495057;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: all 0.1s ease-in-out;
}
</style>


