const RedPack = () => import(/* webpackChunkName:'find' */ "../views/find/RedPack");
const Vip = () => import(/* webpackChunkName:'find' */ "../views/find/Vip");
const VipDetails = () => import(/* webpackChunkName:'find' */ "../views/find/VipDetails");
const YueBaoHome = () => import( /* webpackChunkName:'find' */ "../views/find/YueBaoHome");
const OnlineService = () => import( /* webpackChunkName:'find' */ "../views/find/OnlineService");
const IncomeExpenses = () => import( /* webpackChunkName:'find' */ "../views/find/IncomeExpenses");
const TransferIn = () => import( /* webpackChunkName:'find' */ "../views/find/TransferIn");
const TransferOut = () => import( /* webpackChunkName:'find' */ "../views/find/TransferOut");
const YueBaoList = () => import( /* webpackChunkName:'find' */ "../views/find/YueBaoList");
const WashCode = () => import(/* webpackChunkName:'find' */ "../views/find/WashCode.vue");
const WashCodeDetail = () => import(/* webpackChunkName:'find' */ "../views/find/WashCodeDetail.vue");
const AboutWashCode = () => import(/* webpackChunkName:'find' */ "../views/find/AboutWashCode.vue");
// const AboutWashCodeDetail = () => import(/* webpackChunkName:'find' */ "../views/find/AboutWashCodeDetail.vue");

export default [
  {
    path: '/redpack',
    name: 'redpack',
    component: RedPack,
    meta: {
      requiresAuth :true,
      testIsNo: true,
    }
  },
  {
    path: '/vip',
    name: 'vip',
    component: Vip,
    meta: {
      requiresAuth :true,
      testIsNo: true,
    }
  },
  {
    path: '/vipDetails',
    name: 'vipDetails',
    component: VipDetails,
    meta: {
      requiresAuth :true,
      testIsNo: true
    }
  },
  {
    path: '/yuebaoHome',
    name: 'yuebaoHome',
    component: YueBaoHome,
    meta: {
      requiresAuth: true,
      testIsNo: true
    }
  },
  {
    path: '/onlineService',
    name: 'onlineService',
    component: OnlineService,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      keepAlive: true,
      DocumentTitle: "我的客服"
    }
  },
  {
    path: '/incomeExpenses',
    name: 'incomeExpenses',
    component: IncomeExpenses,
    meta: {
      requiresAuth: true,
      testIsNo: true
    }
  },
  {
    path: '/yuebaoList',
    name: 'yuebaoList',
    component: YueBaoList,
    meta: {
      requiresAuth: true,
      testIsNo: true
    }
  },
  {
    path: '/transferIn',
    name: 'transferIn',
    component: TransferIn,
    meta: {
      requiresAuth: true,
      testIsNo: true
    }
  },
  {
    path: '/transferOut',
    name: 'transferOut',
    component: TransferOut,
    meta: {
      requiresAuth: true,
      testIsNo: true,
    }
  },
  {
    path: '/washcode',
    name: 'washcode',
    component: WashCode,
    meta: {
      requiresAuth :true,
      testIsNo: true
    }
  },
  {
    path: '/washcodedetail/:title/:money',
    name: 'washcodedetail',
    component: WashCodeDetail,
    meta: {
      requiresAuth :true,
      testIsNo: true
    }
  },
  {
    path: '/aboutwashcode',
    name: 'aboutwashcode',
    component: AboutWashCode,
    meta: {
      requiresAuth :true,
      testIsNo: true
    }
  },
  // {
  //   path: '/aboutwashcodedetail/:type/:typeKey/:title',
  //   name: 'aboutwashcodedetail',
  //   component: AboutWashCodeDetail,
  //   meta: {
  //     requiresAuth :true,
  //     testIsNo: true
  //   }
  // },
]
