const weApi = require("./weApis");
const app = getApp();
export const baseURL = ((isDev = false) => {
  isDev = !isDev //开发版本
  return isDev
    ? "http://123.57.43.208:8086/API/"
    : "https://api.cloudokids.cn/API/";
})();
export const weiXinUrl = ((isDev = false) => {
  isDev = !isDev //开发版本
  return isDev
    ? "http://123.57.43.208:8086/"
    : "https://api.cloudokids.cn/";
})();
let get = (op = {}) => {
  return weApi
    .request({
      url: (op.path.indexOf('http') > -1) ? op.path : baseURL + op.path,
      ...op,
      method: "GET"
    })
    .then(res => res.data);
};
let post = (op = {}) => {
  if (!op.header) op.header = {};
  return weApi
    .request({
      url: (op.path.indexOf('http') > -1) ? op.path : baseURL + op.path,
      ...op,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...op.header
      },
      method: "POST"
    })
    .then(res => res.data);
};
// interface proper
exports.login = userInfo => {
  //登录
  return weApi
    .login()
    .then(res => {
      console.log(res);
      //userInfo和code已经获取 直接请求后台登录接口
      return post({
        path: `member/weChatAppletLogin`,
        data: {
          code: res.code,
          encryptedData: userInfo.encryptedData,
          iv: userInfo.iv
        }
      });
    })
    .then(res => {
      console.log(res);
      if (res.status === 2000) {
        wx.setStorageSync("userData", res.data);
        return res.data.userinfo;
      } else {
        throw res;
      }
    });
};
exports.shareCollection = (token,phonetype,channel)=>{  //创建红包
  return post({
    path:"redPacket/shareCollection",
    data:{
      token,
      phonetype,
      channel
    }
  })
}
exports.getMemberRedPacketGroupStatus = (token, phonetype, channel) => {  //查看用户有没有红包
  return get({
    path: "redPacket/getMemberRedPacketGroupStatus",
    data: {
      token,
      phonetype,
      channel
    }
  })
}
exports.showRedPacketGroupProgress = (token, phonetype, channel, redPacketGroupId) => {  //红包进度
  return get({
    path: "redPacket/showRedPacketGroupProgress",
    data: {
      token,
      phonetype,
      channel,
      redPacketGroupId
    }
  })
}
exports.joinRedPacketGroup = (token, phonetype, channel, redPacketGroupId) => {  //加入红包
  return post({
    path: "redPacket/joinRedPacketGroup",
    data: {
      token,
      phonetype,
      channel,
      redPacketGroupId
    }
  })
}
exports.updateRedPacketGroupStatus = (token, phonetype, channel, redPacketGroupId) => {  //领取红包
  return post({
    path: "redPacket/updateRedPacketGroupStatus",
    data: {
      token,
      phonetype,
      channel,
      redPacketGroupId
    }
  })
}
exports.getGroupBookingOrder = ({ token, phonetype, channel, orderStatus }) => {  //订单列表
  return get({
    path: "groupBooking/getGroupBookingOrder",
    data: {
      token,
      phonetype,
      channel,
      orderStatus
    }
  })
}
exports.getGroupBookingActivitys = (token, phonetype, channel, groupBookingType, activityStatus, activityId, activityType) => {
  return get({
    path:"groupBooking/getGroupBookingActivitys",
    data:{
      token, phonetype, channel, groupBookingType, activityStatus, activityId, activityType
    }
  })
},
exports.getGroupIsRookieGroup = (token, phonetype, channel, groupId, orderSn, type, activityId) =>{ //查看用户有没有团
  return get({
    path:"groupBooking/getGroupIsRookieGroup",
    data:{
      token, phonetype, channel, groupId, orderSn, type, activityId
    }
  })
}
exports.getGoodsSkuBySpuId = (token, phonetype, spuId, flag, activityId, type) => {
  return get({
    path: "groupBooking/getGroupGoodsSkuBySpuId",
    data: {
      token, phonetype, spuId, flag, activityId, type
    }
  })
}
exports.joinRookieGroupBooking = (token, phonetype, channel, groupId) => {
  return post({
    path: "groupBooking/joinRookieGroupBooking",
    data: {
      token, phonetype, channel, groupId
    }
  })
}
exports.getActivityGoodsDetail = (activityId) => { 
  return get({
    path: "groupBooking/getActivityGoodsDetail",
    data: {
      activityId
    }
  })
}
exports.getOrderIsSendCoupon = (token, phonetype, channel, orderSn) => { //是否送券
  return get({
    path: "groupBooking/getOrderIsSendCoupon",
    data: {
      token, phonetype, channel, orderSn
    }
  })
}
exports.getActivityLimitStr = () =>{
  return get({
    path: "groupBooking/getActivityLimitStr",
  })
}
// 拼场商品列表
exports.getActivitySpuList = (data) => {
  return get({
    path: "groupBooking/getActivitySpuList",
    data:data
  })
}
// 列表品牌团信息
exports.getMemberIsFullCourtGroupBooking = (data = { token, phonetype, channel ,activityId}) => {
  return get({
    path: "groupBooking/getMemberIsFullCourtGroupBooking",
    data
  })
}
// 列表品牌团信息 个人
exports.listFullCourtGroupBooking = (data = { token, phonetype, channel, activityId }) => {
  return get({
    path: "groupBooking/listFullCourtGroupBooking",
    data
  })
}

// 拼场筛选
exports.getSpuSelect = (activityId) => {
  return get({
    path: "groupBooking/getSpuSelect",
    data:  activityId
  })
}

//  创建拼单
exports.insertGroupBooking = (data = { token, channel, phonetype, activityId, type}) => {
  return post({
    path: "groupBooking/insertGroupBooking",
    data
  })
}

exports.getActivityNameBySpu = (spuId) =>{
  return get({
    path: "groupBooking/getActivityNameBySpu",
    data:{
      spuId,
    }
  })
}
//购物车对应商品

exports.updateCartCheckedByActivityId = (token, channel, phonetype, activityId, checked) => {
  return post({
    path: "cart/updateCartCheckedByActivityId",
    data: { token, channel, phonetype, activityId, checked}
  })
}

//购物车全选/不选
exports.allSelectCart = (data = { token, phonetype, channel, checked }) => {
  return post({
    path: "cart/selectCart",
    data
  })
}
// 加入团
exports.joinGroupBooking = (data = { token, phonetype, channel, groupId }) => {
  return post({
    path: "groupBooking/joinGroupBooking",
    data
  })
}
exports.getMemberIsIntroducer = (token,phonetype,channel) => {
  return get({
    path:'introduce/getMemberIsIntroducer',
    data:{
      token, phonetype, channel
    }
  })
}
exports.bindMemberIntroduce = (token, phonetype, channel, introduceCode) => {
  return post({
    path: 'introduce/bindMemberIntroduce',
    data: {
      token, phonetype, channel, introduceCode
    }
  })
}
exports.getNewOrOldMember = (token, phonetype, channel) => { //判断新老顾客
  return get({
    path:"groupBooking/getNewOrOldMember",
    data:{
      token, phonetype, channel,
    }
  })
}
exports.getMyInformation = (token, phonetype, channel) => {
  return get({
    path:"myModule/getMyInformation",
    data: {
      token, phonetype, channel,
    }
  })
}
exports.getSecret = (token, phonetype, channel) => {
  return get({
    path: "groupBooking/getSecret",
    data: {
      token, phonetype, channel,
    }
  })
}
exports.getMemberQualification = (token, phonetype, channel) => {
  return get({
    path: "groupBooking/getMemberQualification",
    data: {
      token, phonetype, channel,
    }
  })
}
exports.joinInvitation = (token, phonetype, channel,secret)=>{
  return post({
    path: "groupBooking/joinInvitation",
    data: {
      token, phonetype, channel, secret
    }
  })
}
exports.getDHCard = (token, phonetype, channel) => {
  return post({
    path: "groupBooking/getDHCard",
    data: {
      token, phonetype, channel
    }
  })
}

// 数据统计 
exports.analyticsLog = (customData) => {
  let { userInfo, phonetype } = wx.getStorageSync('userData') || {};
  let { channel, version } = getApp().globalData;
  let phone = wx.getStorageSync('phone');
  let tit = ~~(+ new Date / 1000);
  let mustData = {
    mid: userInfo && userInfo.id,
    did: phonetype,
    cid: channel,
    tit,
    ver: version,
    mod: phone.model,
    osv: phone.system,
  }
  return post({
    path: "https://analytics.cloudokids.cn/api/log",
    data: {
      //data: JSON.stringify([{ ...mustData }, ...[{ ...customData }]])
      data: JSON.stringify({ ...mustData, ...customData })
    }
  });
}
exports.getBarrage = (spuId) => {
  return get({
    path: "groupBooking/getBarrage",
    data: {
      spuId
    }
  })
}
exports.getMemberHasFirmOrder = (token, phonetype, channel, activityId) => {
  return get({
    path: "groupBooking/getMemberHasFirmOrder",
    data: {
      token, phonetype, channel, activityId
    }
  })
}
exports.getSpecificationInfoBySpuId = (spuId) => {
  return get({
    path: "groupBookingSpecification/getSpecificationInfoBySpuId",
    data: {
      spuId
    }
  })
}
exports.getShareMessage = (userId, activityId) => {
  return get({
    path: "groupBooking/getShareMessage",
    data: {
      userId, activityId
    }
  })
}