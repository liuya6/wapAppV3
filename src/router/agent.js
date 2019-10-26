const Recommend = () => import( /* webpackChunkName:'team' */ "../views/agent/Recommend");
const MyRebate = () => import( /* webpackChunkName:'team' */ "../views/agent/MyRebate");
const TeamBetRecord = () => import( /* webpackChunkName:'team' */ "../views/agent/TeamBetRecord");
const TeamBetRecordList = () => import( /* webpackChunkName:'team' */ "../views/agent/TeamBetRecordList");
const TeamContacts = () => import( /* webpackChunkName:'team' */ "../views/agent/TeamContacts");
const TeamContactsList = () => import( /* webpackChunkName:'team' */ "../views/agent/TeamContactsList");
const TeamRule = () => import( /* webpackChunkName:'team' */ "../views/agent/TeamRule");
const TeamMember = () => import( /* webpackChunkName:'team' */ "../views/agent/TeamMember");
const TeamDetail = () => import( /* webpackChunkName:'team' */ "../views/agent/TeamDetail");
const TeamReport = () => import( /* webpackChunkName:'team' */ "../views/agent/TeamReport");
const TgManagement = () => import( /* webpackChunkName:'team' */ "../views/agent/TgManagement");
const UnderReport = () => import( /* webpackChunkName:'team' */ "../views/agent/UnderReport");
const AddLink = () => import( /* webpackChunkName:'team' */ "../views/agent/AddLink");
const RebateDetail = () => import( /* webpackChunkName:'team' */ "../views/agent/RebateDetail");

export default [
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true
    }
  },
  {
    path: '/myRebate',
    name: 'myRebate',
    component: MyRebate,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true
    }
  },
  {
    path: '/teamBetRecord',
    name: 'teamBetRecord',
    component: TeamBetRecord,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true,
      keepAlive: true,
      DocumentTitle: "团队投注记录"
    }
  },
  {
    path: '/teamBetRecordList',
    name: 'teamBetRecordList',
    component: TeamBetRecordList,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true
    }
  },
  {
    path: '/teamContacts',
    name: 'teamContacts',
    component: TeamContacts,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true,
      keepAlive: true,
      DocumentTitle: "团队往来记录"
    }
  },
  {
    path: '/teamContactsList',
    name: 'teamContactsList',
    component: TeamContactsList,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true
    }
  },
  {
    path: '/teamRule',
    name: 'teamRule',
    component: TeamRule,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true
    }
  },
  {
    path: '/teamMember',
    name: 'teamMember',
    component: TeamMember,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true,
      keepAlive: true,
      DocumentTitle: "团队成员"
    }
  },
  {
    path: '/teamDetail',
    name: 'teamDetail',
    component: TeamDetail,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true
    }
  },
  {
    path: '/teamReport/:username?',
    name: 'teamReport',
    component: TeamReport,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true
    }
  },
  {
    path: '/tgManagement',
    name: 'tgManagement',
    component: TgManagement,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true,
    }
  },
  {
    path: '/underReport',
    name: 'underReport',
    component: UnderReport,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true,
      keepAlive: true,
      DocumentTitle: "下级报表"
    }
  },
  {
    path: '/addLink',
    name: 'addLink',
    component: AddLink,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true
    }
  },
  {
    path: '/rebateDetail/:id',
    name: 'rebateDetail',
    component: RebateDetail,
    meta: {
      requiresAuth: true,
      testIsNo: true,
      team: true
    }
  },
]