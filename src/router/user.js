const User = () => import( /* webpackChunkName:'start' */ "../views/user/User");
const Notice = () => import( /* webpackChunkName:'start' */ "../views/user/Notice");
const SecurityCenter = () => import( /* webpackChunkName:'user' */ "../views/user/SecurityCenter");
const Register = () => import( /* webpackChunkName:'start' */ "../views/user/Register");
const Login = () => import( /* webpackChunkName:'start' */ "../views/user/Login");
const Amount = () => import( /* webpackChunkName:'user' */ "../views/user/Amount");
const Bill = () => import( /* webpackChunkName:'user' */ "../views/user/Bill");
const AboutUs = () => import( /* webpackChunkName:'user' */ "../views/user/AboutUs");
const Help = () => import( /* webpackChunkName:'user' */ "../views/user/Help");
const UserTreaty = () => import( /* webpackChunkName:'start' */ "../views/user/UserTreaty");
const ProfitAndLoss = () => import( /* webpackChunkName:'user' */ "../views/user/ProfitAndLoss");
const Record = () => import( /* webpackChunkName:'user' */ "../views/user/Record");
const SelectBankCard = () => import( /* webpackChunkName:'withdraw' */ "../views/user/SelectBankCard");
const BankCard = () => import( /* webpackChunkName:'withdraw' */ "../views/user/BankCard");
const AddBankCard = () => import( /* webpackChunkName:'withdraw' */ "../views/user/AddBankCard");
const Service = () => import( /* webpackChunkName:'user' */ "../views/user/Service");
const ModifyPwd = () => import( /* webpackChunkName:'userCenter' */ "../views/user/ModifyPwd");
const PayeeName = () => import( /* webpackChunkName:'userCenter' */ "../views/user/PayeeName");
const VerifyPhone = () => import( /* webpackChunkName:'userCenter' */ "../views/user/VerifyPhone");
const BindEmail = () => import( /* webpackChunkName:'userCenter' */ "../views/user/BindEmail");
const FundPwd = () => import( /* webpackChunkName:'userCenter' */ "../views/user/FundPwd");
const Suggestions = () => import( /* webpackChunkName:'user' */ "../views/user/Suggestions");
const MsgDetail = () => import( /* webpackChunkName:'msg' */ "../views/user/MsgDetail");
const MySpread = () => import( /* webpackChunkName:'msg' */ "../views/user/MySpread");
const Download = () => import( /* webpackChunkName:'msg' */ "../views/user/Download");
// const LoginPwd = () => import("../views/user/LoginPwd");
// const NextLoginPwd = () => import("../views/user/NextLoginPwd");
// const Set = () => import("../views/user/Set");
// const ScanCodeSubmit = () => import( /* webpackChunkName:'recharge' */ "../views/user/ScanCodeSubmit");
// const BankSubmit = () => import( /* webpackChunkName:'recharge' */ "../views/user/BankSubmit");

export default [
  {
    path: '/user',
    name: 'user',
    component: User,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/myspread',
    name: 'myspread',
    component: MySpread,
    meta: {
      requiresAuth: true,
      testIsNo: true
    }
  },
  {
    path: '/download',
    name: 'download',
    component: Download,
    meta: {
      testIsNo: true
    }
  },
  {
    path: '/notice/:type?',
    name: 'notice',
    component: Notice,
  },
  {
    path: '/securityCenter',
    name: 'securityCenter',
    component: SecurityCenter,
    meta: {
      requiresAuth: true,
      testIsNo: true
    }
  },

  {
    path: '/register/:xcode?',
    name: 'register',
    component: Register,
    meta: {
      denyAuth: true // 拒绝登录访问
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      denyAuth: true // 拒绝登录访问
    }
  },
  {
    path: '/amount',
    name: 'amount',
    component: Amount,
    meta: {
      requiresAuth: true,
      testIsNo: true
    }
  },
  {
    path: '/bill',
    name: 'bill',
    component: Bill,
  },
  {
    path: '/aboutus',
    name: 'aboutus',
    component: AboutUs,
  },
  {
    path: '/help',
    name: 'help',
    component: Help,
  },
  {
    path: '/usertreaty',
    name: 'usertreaty',
    component: UserTreaty,
  },
  {
    path: '/profitandloss',
    name: 'profitandloss',
    component: ProfitAndLoss,
  },
  {
    path: '/record',
    name: 'record',
    component: Record,
  },
  {
    path: '/selectbankcard',
    name: 'selectbankcard',
    component: SelectBankCard,
  },
  {
    path: '/bankcard',
    name: 'bankcard',
    component: BankCard,
  },
  {
    path: '/addbankcard',
    name: 'addbankcard',
    component: AddBankCard,
  },
  {
    path: '/service',
    name: 'service',
    component: Service,
  },
  {
    path: '/modifyPwd',
    name: 'modifyPwd',
    component: ModifyPwd,
  },
  {
    path: '/payeeName',
    name: 'payeeName',
    component: PayeeName,
  },
  {
    path: '/verifyPhone',
    name: 'verifyPhone',
    component: VerifyPhone,
  },
  {
    path: '/bindEmail',
    name: 'bindEmail',
    component: BindEmail,
  },
  {
    path: '/fundPwd',
    name: 'fundPwd',
    component: FundPwd,
  },
  {
    path: '/suggestions',
    name: 'suggestions',
    component: Suggestions,
  },
  {
    path: '/msgdetail',
    name: 'msgdetail',
    component: MsgDetail,
  },
  // {
  //   path: '/set',
  //   name: 'set',
  //   component: Set,
  //   meta: {
  //     requiresAuth :true,
  //     testIsNo: true
  //   }
  // },
  // {
  //   path: '/transfer/:id?/:type?',
  //   name: 'transfer',
  //   component: Transfer,
  // },
  // {
  //   path: '/scancodesubmit',
  //   name: 'scancodesubmit',
  //   component: ScanCodeSubmit,
  // },
  // {
  //   path: '/banksubmit',
  //   name: 'banksubmit',
  //   component: BankSubmit,
  // },
  // {
  //   path: '/transfersubmit',
  //   name: 'transfersubmit',
  //   component: TransferSubmit,
  // },
]
