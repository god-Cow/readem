
let bindAPI = (apiName, bindObj=wx)=>(o={})=>new Promise((resolve, reject)=>{
  bindObj[apiName](Object.assign({}, o, {
    success: resolve,
    fail: reject
  }))
});
// 接口的命名空间
let apiSpace = {
  // 网络
  net: [
    'request',
    'uploadFile',
    'downloadFile',
    'connectSocket',
    'onSocketOpen',
    'onSocketError',
    'sendSocketMessage',
    'onSocketMessage',
    'closeSocket',
    'onSocketClose'
  ],
  // 数据缓存
  dataCache:[
    'setStorage',
    'getStorage',
    'setStorageSync',
    'getStorageSync',
    'getStorageInfo',
    'removeStorage',
    'clearStorage',
  ],
  // location
  location:[
    'getLocation',
    'chooseLocation',
    'openLocation',
  ],
  // 设备
  device: [
    // 网络状态
    'getNetworkType',
  ],
  // 界面
  userface: [
    // 交互反馈
    'showToast',
    'showLoading',
    'hideToast',
    'hideLoading',
    'showModal',
    'showActionSheet',

    // 导航
    'navigateTo',
    'redirectTo',
    'reLaunch',
    'switchTab',
    'navigateBack',

  ],


  // 开发接口
  openAPI: [
    'login',
    'checkSession',

    // 授权
    'authorize',
    'getUserInfo',

    // 支付
    'requestPayment',

    // 设置
    'getSetting',
    'openSetting',
  ]
}

let crudeNameArr = [];
for(let k in apiSpace){
  crudeNameArr = [...crudeNameArr, ...apiSpace[k]]
}

const weApi = crudeNameArr.reduce( (accu,elt)=>{
  if(Object.prototype.toString.call(elt)==='[object String]'){
    accu[elt] = bindAPI(elt)
  }else{
    accu[elt.name] = bindAPI(elt.name, elt.thisArg)
  }
  return accu; 
}, {});

module.exports = weApi;
