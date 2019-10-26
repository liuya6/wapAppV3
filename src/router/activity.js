const Activity = () => import(/* webpackChunkName:'start' */ "../views/activity/Activity");
const ActivityContent = () => import(/* webpackChunkName:'activity' */ "../views/activity/ActivityContent");
const ApplyActivityList = () => import(/* webpackChunkName:'activity' */ "../views/activity/Applyactivitylist.vue");
const ApplyActivityDetail = () => import(/* webpackChunkName:'activity' */ "../views/activity/ApplyActivityDetail.vue");

export default [
  {
    path: '/activity',
    name: 'activity',
    component: Activity,
    meta: {
      keepAlive: true,
      DocumentTitle: "活动"
    }
  },
  {
    path: "/activitycontent",
    name: "activitycontent",
    component: ActivityContent,
  },
  {
    path: "/applyactivitylist",
    name: "applyactivitylist",
    component: ApplyActivityList,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/applyactivitydetail/:id",
    name: "applyactivitydetail",
    component: ApplyActivityDetail
  }
]
