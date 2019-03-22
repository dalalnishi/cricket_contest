import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Overview from 'src/components/Dashboard/Views/Overview.vue'
//import UserProfile from 'src/components/Dashboard/Views/UserProfile.vue'
// import TableList from 'src/components/Dashboard/Views/TableList.vue'
// import Typography from 'src/components/Dashboard/Views/Typography.vue'
// import Icons from 'src/components/Dashboard/Views/Icons.vue'
// import Maps from 'src/components/Dashboard/Views/Maps.vue'
// import Notifications from 'src/components/Dashboard/Views/Notifications.vue'

import Login from '../components/Login/Login.vue';
import Registration from '../components/Registration/Registration.vue';
import Tournaments from '../components/Tournaments/Tournaments.vue';
import Teams from '../components/Teams/Teams.vue';
import Players from '../components/Players/Players.vue';
import TournamentTeamPlayers from '../components/TournamentTeamPlayers/TournamentTeamPlayers.vue';
import TournamentMatches from '../components/TournamentMatches/TournamentMatches.vue';
import TournamentPoints from '../components/TournamentPoints/TournamentPoints.vue';
import PlayersScore from '../components/PlayersScore/PlayersScore.vue';

const routes = [
  {
    path: '/dashboard',
    component: DashboardLayout,
    redirect: '/admin/overview'
  },
  {
    path: '/',
    component: Login
  },
  {
    path: '/registration',
    component: Registration
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/overview',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview
      },
      {
        path: '/tournaments',
        component: Tournaments
      },
      {
        path: '/teams',
        component: Teams
      },
      {
        path: '/players',
        component: Players
      },
      {
        path: '/TournamentTeamPlayers',
        component: TournamentTeamPlayers
      },
      {
        path: '/TournamentMatches',
        component: TournamentMatches
      },
      {
        path: '/TournamentPoints',
        component: TournamentPoints
      },
      {
        path: '/PlayerScores',
        component: PlayersScore
      }
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
