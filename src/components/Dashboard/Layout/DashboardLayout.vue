<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/admin/overview">
        <i class="fa fa-pie-chart" aria-hidden="true"></i>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/tournaments">
        <i class="fa fa-trophy" aria-hidden="true"></i>
        <p>Tournaments</p>
      </sidebar-link>
      <sidebar-link to="/teams">
        <i class='fa fa-users' aria-hidden="true"></i>
        <p>Teams</p>
      </sidebar-link>
      <sidebar-link to="/players">
        <i class="material-icons" style="font-size:36px">rowing</i>
        <p>Players</p>
      </sidebar-link>
      <sidebar-link to="/TournamentTeamPlayers">
        <i class="material-icons" style="font-size:36px">rowing</i>
        <p>Tournament Team Players</p>
      </sidebar-link>
      <sidebar-link to="/TournamentMatches">
        <i class="material-icons" style="font-size:36px">rowing</i>
        <p>Tournament Matches</p>
      </sidebar-link>
      <sidebar-link to="/TournamentPoints">
        <i class="material-icons" style="font-size:36px">rowing</i>
        <p>Tournament Points</p>
      </sidebar-link>
      <sidebar-link to="/PlayerScores">
        <i class="material-icons" style="font-size:36px">rowing</i>
        <p>Match Players Scores</p>
      </sidebar-link>
      <!-- <sidebar-link to="/admin/table-list">
        <i class="nc-icon nc-notes"></i>
        <p>Table list</p>
      </sidebar-link>
      <sidebar-link to="/admin/typography">
        <i class="nc-icon nc-paper-2"></i>
        <p>Typography</p>
      </sidebar-link>
      <sidebar-link to="/admin/icons">
        <i class="nc-icon nc-atom"></i>
        <p>Icons</p>
      </sidebar-link>
      <sidebar-link to="/admin/maps">
        <i class="nc-icon nc-pin-3"></i>
        <p>Maps</p>
      </sidebar-link>
      <sidebar-link to="/admin/notifications">
        <i class="nc-icon nc-bell-55"></i>
        <p>Notifications</p>
      </sidebar-link> -->
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './MobileMenu.vue'
  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    },
    beforeRouteEnter(to, from, next) {
        if(!localStorage.token) {
            next('/');
        }
        else if(localStorage.token) {
            next(true);
        }else {
            next(false);
        }
    }
  }

</script>

<style>
  .sidebar .nav, body > .navbar-collapse .nav  {
      width: max-content;
    }
</style>
