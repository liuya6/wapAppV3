const Home = () => import(/* webpackChunkName:'start' */ "../views/home/Home");
const GamesLobby = () => import(/* webpackChunkName:'start' */ "../views/home/GamesLobby");
const ElectronicGames = () => import(/* webpackChunkName:'start' */ "../views/home/ElectronicGames");
const ServicePage = () => import(/* webpackChunkName:'start' */ "../views/home/ServicePage");
// const Playing = () => import("../views/home/Playing");

export default [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      keepAlive: true,
    }
  },
  {
    path: '/gamesLobby/:classify?',
    name: 'GamesLobby',
    component: GamesLobby,
    meta: {
      keepAlive: true,
      DocumentTitle: "游戏大厅"
    }
  },
  {
    path: '/electronicGames/:typeKey/:classify',
    name: 'electronicGames',
    component: ElectronicGames,
  },
  {
    path: '/servicePage',
    name: 'servicePage',
    component: ServicePage,
  },
  // {
  //   path: '/playing/:typeKey?/:classify?',
  //   name: 'playing',
  //   component: Playing,
  // },
]
