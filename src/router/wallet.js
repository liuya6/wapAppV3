const Wallet = () => import(/* webpackChunkName:'start' */ "../views/wallet/Wallet");
const Withdraw = () => import(/* webpackChunkName:'withdraw' */ "../views/wallet/Withdraw");
const RechargeRecord = () => import(/* webpackChunkName:'start' */ "../views/wallet/RechargeRecord");
const WithdrawalsRecord = () => import (/* webpackChunkName:'withdraw' */ "../views/wallet/WithdrawalsRecord");
const Paying = () => import(/* webpackChunkName:'recharge' */ "../views/wallet/Paying");
const HumanPaying = () => import(/* webpackChunkName:'recharge' */ "../views/wallet/HumanPaying");
const ScanCodePaying = () => import( /* webpackChunkName:'recharge' */ "../views/wallet/ScanCodePaying");
const BankPaying = () => import( /* webpackChunkName:'recharge' */ "../views/wallet/BankPaying");
const rechargeSubmit = () => import(/* webpackChunkName:'recharge' */ "../views/wallet/rechargeSubmit");
const OrderTrack = () => import(/* webpackChunkName:'recharge' */ "../views/wallet/OrderTrack");
const Chat = () => import(/* webpackChunkName:'recharge' */ "../views/chat/Chat");
const BankReceipt = () => import(/* webpackChunkName:'recharge' */ "../views/chat/BankReceipt");
const OtherReceipt = () => import(/* webpackChunkName:'recharge' */ "../views/chat/OtherReceipt");

export default [
  {
    path: '/wallet',
    name: 'wallet',
    component: Wallet,
    meta: {
      requiresAuth :true,
      testIsNo: true,
      keepAlive: true,
      DocumentTitle: "充值"
    }
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    component: Withdraw,
    meta: {
      requiresAuth :true,
      testIsNo: true
    }
  },
  {
    path: '/rechargerecord',
    name: 'rechargerecord',
    component: RechargeRecord,
    meta: {
      requiresAuth :true,
      testIsNo: true
    }
  },
  {
    path: '/withdrawrecord',
    name: 'withdrawrecord',
    component: WithdrawalsRecord,
    meta: {
      requiresAuth :true,
      testIsNo: true
    }
  },
  {
    path: '/paying',
    name: 'paying',
    component: Paying,
    meta: {
      requiresAuth :true,
      testIsNo: true
    }
  },
  {
    path: '/humanpaying/:payWay/:id/:type?',
    name: 'humanpaying',
    component: HumanPaying,
    meta: {
      requiresAuth :true,
      testIsNo: true
    }
  },
  {
    path: '/scancodepaying/:id?',
    name: 'scancodepaying',
    component: ScanCodePaying,
  },
  {
    path: '/bankpaying/:id?',
    name: 'bankpaying',
    component: BankPaying,
  },
  {
    path: '/rechargesubmit',
    name: 'rechargesubmit',
    component: rechargeSubmit,
    meta: {
      requiresAuth :true,
      testIsNo: true
    }
  },
  {
    path: '/orderTrack',
    name: 'orderTrack',
    component: OrderTrack,
    meta: {
      requiresAuth :true,
      testIsNo: true
    }
  },
  {
    path: '/chat',
    name: 'chat',
    component: Chat,
    meta: {
      requiresAuth :true,
      testIsNo: true,
      keepAlive: true
    }
  },
  {
    path: '/BankReceipt',
    name: 'bankReceipt',
    component: BankReceipt,
    meta: {
      requiresAuth: true,
      testIsNo: true
    }
  },
  {
    path: '/otherReceipt',
    name: 'otherReceipt',
    component: OtherReceipt,
    meta: {
      requiresAuth: true,
      testIsNo: true
    }
  }
]
