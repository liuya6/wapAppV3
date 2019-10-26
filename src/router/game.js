const LotteryHall = () => import(/* webpackChunkName:'start' */ "../views/lotteryGame/LotteryHall");
const Bet = () => import(/* webpackChunkName:'start' */ "../views/lotteryGame/Bet");
const ConfirmPurchase = () => import(/* webpackChunkName:'lottery' */ "../views/lotteryGame/ConfirmPurchase");
const ChasingCode = () => import(/* webpackChunkName:'lottery' */ "../views/lotteryGame/ChasingCode");
const Cart = () => import(/* webpackChunkName:'lottery' */ "../views/lotteryGame/Cart");
const BetRecord = () => import(/* webpackChunkName:'lottery' */ "../views/lotteryGame/BetRecord");
const GameTrend = () => import(/* webpackChunkName:'lottery' */ "../views/lotteryGame/GameTrend");
const GameDescription = () => import(/* webpackChunkName:'lottery' */ "../views/lotteryGame/GameDescription");
const BetHistory = () => import(/* webpackChunkName:'lottery' */ "../views/lotteryGame/BetHistory");
const ChangLong = () => import(/* webpackChunkName:'lottery' */ "../views/lotteryGame/ChangLong");
const ChangLongLegend = () => import(/* webpackChunkName:'lottery' */ "../views/lotteryGame/ChangLongLegend");
const LotteryDetails = () => import(/* webpackChunkName:'lottery' */ "../views/lotteryGame/LotteryDetails");

export default [
  {
    path: "/hall",
    name: "hall",
    component: LotteryHall,
    meta: {
      keepAlive: true,
      DocumentTitle: "彩票大厅"
    }
  },
  {
    path: "/bet/:id/:classify",
    name: "bet",
    component: Bet,
  },
  {
    path: "/bet/confirm/:id/:classify",
    name: "confirmpurchase",
    component: ConfirmPurchase
  },
  {
    path: "/bet/chasing/:id/:classify",
    name: "chasingcode",
    component: ChasingCode
  },
  {
    path: "/bet/cart/:id/:classify",
    name: "cart",
    component: Cart
  },
  {
    path: "/bet/record/:id/:classify",
    name: "betrecord",
    component: BetRecord
  },
  {
    path: "/bet/trend/:id/:classify",
    name: "gametrend",
    component: GameTrend
  },
  {
    path: "/bet/gamedescription/:id/:classify",
    name: "gamedescription",
    component: GameDescription
  },
  {
    path: "/bet/history/:id/:modeName",
    name: "bethistory",
    component: BetHistory
  },
  {
    path: "/changlong",
    name: "changlong",
    component: ChangLong
  },
  {
    path: "/changlonglegend",
    name: "changlonglegend",
    component: ChangLongLegend
  },
  {
    path: "/lotterydetails",
    name: "lotterydetails",
    component: LotteryDetails
  }
]
