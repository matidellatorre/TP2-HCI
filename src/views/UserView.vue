<template>
  <v-main id="main-content">
    <div v-if="currentUser" class="d-flex justify-center fill-height align-start"  >
      <v-card width="30%" class="d-flex flex-column px-10 pb-lg-7 pb-xl-10 pt-xl-7 pt-lg-3 mt-8 mt-xl-16 text-center rounded-xl elevation-2" max-width="500px" max-height="550px" min-width="300px" >
      <h1 class="secondary--text">My profile</h1>
        <div class="text-center mt-xl-5 mt-lg-3">
          <img v-if="currentUser" class="rounded-circle elevation-3" v-bind:src="this.currentUser.avatarUrl" width="150px" height="150px">
        </div>
        <v-text-field
            @keydown="wasEdited=true"
            label="Name"
            name="Name"
            type="text"
            v-model="currentUser.firstName"
            color="secondary"
            class="mt-xl-5 mt-lg-3" />
        <v-text-field
            @keydown="wasEdited=true"
            label="Username"
            name="Username"
            v-model="currentUser.username"
            type="text"
            color="secondary"
            disabled
        />
        <v-text-field
            label="Email"
            name="Email"
            v-model="currentUser.email"
            type="text"
            color="secondary"
            disabled
        />
        <div class="d-flex justify-center my-xl-3 my-lg-1">
          <v-btn rounded @click="saveCurrentUser()" color="secondary" class="mr-5 rounded-xl" :disabled="wasEdited==false">Save</v-btn>
          <v-btn outlined dark color="red" @click="logout(); $router.push('/')" class="ml-5 rounded-xl">Log out</v-btn>
        </div>
      </v-card>
    </div>
  </v-main>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useSecurityStore } from "@/store/SecurityStore";
import { Credentials } from "@/api/user";

export default {
  name: 'UserView',
  props: {
    source: String,
  },
  data() {
    return {
      step: 1,
      userVerificated: false,
      credentials: new Credentials,
      result: null,
      controller: null,
      wasEdited: false,
      currentUser: null
    }
  },
  methods: {
    async sendcredentials() {
      await this.login();
      await this.getCurrentUser();
      console.log(this.$user.username);
    },
    async talogueado() {
      await this.logout();
      console.log(this.$isLoggedIn);
      console.log(this.$user);
    },
    ...mapActions(useSecurityStore, {
      $getCurrentUser: 'getCurrentUser',
      $login: 'login',
      $logout: 'logout',
      $modifyCurrentUser: 'modifyCurrentUser'
    }),
    setResult(result){
      this.result = JSON.stringify(result, null, 2)
    },
    clearResult() {
      this.result = null
    },
    async logout() {
      await this.$logout()
      this.clearResult()
    },
    async getCurrentUser() {
      await this.$getCurrentUser()
      this.setResult(this.$user)
    },
    async saveCurrentUser() {
      console.log('Saving user')
      const res = await this.$modifyCurrentUser(this.currentUser)
      this.setResult(res)
    },
    abort() {
      this.controller.abort()
    }
  },
  computed: {
    ...mapState(useSecurityStore, {
      $user: state => state.user,
    }),
    ...mapState(useSecurityStore, {
      $isLoggedIn: 'isLoggedIn',
    }),
  },
  watch: {
    $user: function() {
      this.currentUser = {...this.$user}
    }
  },
  created() {
    this.currentUser = this.$user
  }
};
</script>

<style scoped>
#main-content {
  background: url("@/assets/bg3.jpeg");
  background-size: cover;
}
</style>