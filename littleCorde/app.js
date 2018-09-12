var aldstat = require("./utils/ald-stat.js");
var tdweapp = require("utils/index.js");
var dgt = require('./utils/dgt.js');
const req = require('./utils/request');
const weApi = require('utils/weApis');
var weiXinUrl = req.baseURL;

App({
  api: {
    topTen: weiXinUrl +"goodsDetail/listSalesTopTen",
    attentionUrl: weiXinUrl + "bargain/addBargainConcern",//关注商品
    unfollowUrl: weiXinUrl + "bargain/cancelBargainConcern",//取消关注
    rangeUrl: weiXinUrl + "bargain/getBargainInfo",//拉去砍价幅度
    recordUrl: weiXinUrl + "bargain/getBargainMemberInfo",//拉去砍价记录
    bargainlistUrl: weiXinUrl + "bargain/listBargainItem",//拉去砍价商品记录，
    createBargaintUrl: weiXinUrl + "bargain/createBargain",//开启砍价，
    addBargainUrl: weiXinUrl + "bargain/addBargain",//帮砍一刀，
    pastdueUrl: weiXinUrl + "bargain/getBargainInfoById",//查看砍价团是否过期
    getSpecialUrl: weiXinUrl + "homepage/getSpecial",//拉去专题
    listUrl: weiXinUrl + "shareActivity/listShareActivityGoods",
    discountGoodsurl: weiXinUrl +"shareActivity/getShareActivityGoodsBySpuId",
    recodeMemberShare: weiXinUrl +"shareActivity/recodeMemberShare",
    cashSaleUrl: weiXinUrl + "groupBooking/getDomesticGoods",
    weChatAppletLogin: weiXinUrl + "member/weChatAppletLogin", //登录
    getCode: weiXinUrl + "member/getPhoneCode",//获取验证码
    getGoodsDetail: weiXinUrl + "goodsDetail/getShowGoodsDetail",//商品详情
    getCollageBySpuId: weiXinUrl + "collage/getCollageByspuId",//商品详情获取相关搭配
    getMyInfo: weiXinUrl + "myModule/getMyInformation",//获取个人信息
    getCartShop: weiXinUrl + "cart/listShoppingCart",  //购物车列表
    getNewCartShop: weiXinUrl + "cart/updateCart", //更新购物车
    allSelectCart: weiXinUrl + "cart/selectCart", //购物车全选
    myOrder: weiXinUrl + "myModule/getMyOrder", //我的订单
    delCart: weiXinUrl + "cart/deleteCart", //删除购物车
    getGiffCardList: weiXinUrl + "initOrder/getGiftCardList", //礼品卡列表
    getDiscountCardList: weiXinUrl + "initOrder/getDiscountCardList", //优惠券列表
    getBrandSizeByBrandId: weiXinUrl + "brand/getBrandSizeByBrandId", //获取尺码对照表
    getBrand: weiXinUrl + "brand/getBrand", //获取品牌分类
    getGoodsSkuBySpuId: weiXinUrl + "goodsSku/getGoodsSkuBySpuId", //购物车获取尺码
    weekNew: weiXinUrl + "homepage/getBodyHomePage", //获取本周新品specialId
    getCollageByCollageId: weiXinUrl + "collage/getCollageByCollageId", //根据搭配Id获取搭配的信息 
    getCollageSPUByCollageId: weiXinUrl + "collage/getCollageSPUByCollageId",//根据搭配Id查询包含的SPU
    addCart: weiXinUrl + "cart/addCart", //添加到购物车 
    addFavorite: weiXinUrl + "favorite/addFavorite", //添加收藏
    deleteFavorite: weiXinUrl + "favorite/deleteFavorite", //删除收藏
    favoriteBySPUidAndMemberId: weiXinUrl + "favorite/favoriteBySPUidAndMemberId", //查询商品是否收藏
    addCollageLike: weiXinUrl + "buyer/addCollageLike", //搭配点赞
    bodyHomePage: weiXinUrl + "homepage/getBodyHomePage",  //获取首页灵感商品
    getAddressList: weiXinUrl + "initOrder/getAddressList", // 获取用户地址列表 
    getAttrInfo: weiXinUrl + "homepage/getQueryInfoSpecialBySpecialTopicId",//获取相关筛选属性
    getRankingInfo: weiXinUrl + "categorySales/getSortInfo",//获取相关排序信息
    deleteAddress: weiXinUrl + "myModule/deleteAddress", //删除地址
    getRegion: weiXinUrl + "addressManagement/getRegion", //省市联动
    addAddress: weiXinUrl + "myModule/addAddress", //添加地址
    updateMemberAddress: weiXinUrl + "myModule/updateMemberAddress", //编辑地址
    getMemberPointLog: weiXinUrl + "myModule/getMemberPointLog", // 积分明细
    getFavorite: weiXinUrl + "favorite/getFavorite", //我的收藏
    updateMyModuleMember: weiXinUrl + "myModule/updateMyModuleMember", // 修改个人信息
    getOrderByMemberIdOrderSn: weiXinUrl + "order/getOrderByMemberIdOrderSn", //获取订单信息
    getOrderSKU: weiXinUrl + "order/getOrderSKU", // 获取订单商品信息
    getExpressList: weiXinUrl + 'initOrder/getExpressList', //获取用户快递列表
    getPoint: weiXinUrl + "initOrder/getPoint", //获取用户可用积分
    getAllMoney: weiXinUrl + "initOrder/getSettlement", // 获取订单金额
    activeCard: weiXinUrl + "card/activeCard", //兑换礼品卡优惠券
    getLastPiece: weiXinUrl + "buyerChannel/getAvailableLastOne", // 获取最后一件
    submitMyOrder: weiXinUrl +"order/placeOrder",  //提交订单
    weChatAppletPay: weiXinUrl +"appletPay/weChatAppletPay" ,//获取code
    jumpToPayResult: weiXinUrl + "redPackets/jumpToPayResult", //支付成功
    getCategorySales: weiXinUrl + "categorySales/getCategorySales", //获取分类
    getQueryInfoByCategoryId: weiXinUrl + "categorySales/getQueryInfoByCategoryId", //分类筛选
    getSpecialById: weiXinUrl + "homepage/getSpecialById", //获取topicId
    getQueryInfoByBrandId: weiXinUrl + "brand/getQueryInfoByBrandId" , //获取品牌筛选
    getProductsByBrandId: weiXinUrl + "brand/getProductsByBrandId", //获取同品牌其他商品
    getOtherRecommend: weiXinUrl + "goodsDetail/getOtherRecommend", //获取其他推荐商品
    getCheckGoodsInfo: weiXinUrl + "cart/getCheckGoodsInfo", //获取国内外几件
    getCartListInfo: weiXinUrl + "cart/listShoppingCartInfo", //获取购物车列表
    search:"https://api.cloudokids.cn/ESApi/goodsSearch/search", // 搜索
    getQueryInfoByQueryString:"https://api.cloudokids.cn/ESApi/goodsSearch/getQueryInfoByQueryString", //搜索
    getFavoriteNumber: weiXinUrl + "statistical/getFavoriteFollowCollageMessagesNumber", //获取数字
    getGoodsInfoByTopicId: weiXinUrl + "homepage/getGoodsInfoByTopicId",
    insertShareLog: weiXinUrl + "share/insertShareLog", //插入分享记录
    getShareAndShoppingLog: weiXinUrl + "share/getShareAndShoppingLog", //查询是否分享过
    getOrderMemberCountByChannel: weiXinUrl + "statistical/getOrderMemberCountByChannel" , // 查询多少人买过
    insertGroupBooking: weiXinUrl + "groupBooking/insertGroupBooking", //创建团
    getGroupInfo: weiXinUrl + "groupBooking/getGroupInfo",  //获取团的信息
    joinGroupBooking: weiXinUrl + "groupBooking/joinGroupBooking", // 加入团
    quitGroupBooking: weiXinUrl + "groupBooking/quitGroupBooking", // 退出团
    getGroupList: weiXinUrl + "groupBooking/getGroupList", //获取拼团列表
    showLmg: "https://api.cloudokids.cn/uploadsystem/makeWxImg/showImg2", //生成图片1
    addWXFormId: weiXinUrl + "addressManagement/addWXFormId", //添加formId
    getMemberIsIntroducer: weiXinUrl + "introduce/getMemberIsIntroducer", //是否是推手
    addIntroducer: weiXinUrl + "introduce/addIntroducer", //加入推手
    awardValid:weiXinUrl+"introduce/getMemberIsIntroducer",//可提金额
    fansList: weiXinUrl + "introduce/listMemberIntroduce",//粉丝列表
    saleGoodsDetail: weiXinUrl + "introduce/listIntroducerSales",//售货明细
    bindMemberIntroduce: weiXinUrl + "introduce/bindMemberIntroduce", // 绑定关系
    getWXSystemPhoneCode: weiXinUrl + "member/getWXSystemPhoneCode", //获取短信验证码
    bindWXSystemPhone: weiXinUrl + "member/bindWXSystemPhone", //绑定微信用户
    getCardList: weiXinUrl + "initOrder/getCardList", //获取卡券列表
    getGroupBookingCondition: weiXinUrl + "groupBooking/getGroupBookingCondition", //获取折扣金额
    getOrderParcelInfoByOrderSn: weiXinUrl + "orderParcel/getOrderParcelInfoByOrderSn", //订单详情
    getValidSpecialList: weiXinUrl + "groupBooking/getValidSpecialList", //获取有活动的专题id
    getShoppingCart: weiXinUrl + "cart/getShoppingCart", //根据skuId查询商品信息
    getSingleSettlement: weiXinUrl + "initOrder/getSingleSettlement", //根据skuId获取金额
    listDiscountCard: weiXinUrl + "initOrder/listDiscountCard", //根据skuId查优惠券
    listGiftCard: weiXinUrl + "initOrder/listGiftCard", //根据skuId查礼品卡
    placeSingleOrder: weiXinUrl + "order/placeSingleOrder", //根据skuId提交订单
    getHeadHomePage: weiXinUrl + "homepage/getHeadHomePage", //首页轮播
    getRecommendationList: weiXinUrl + "recommendation/getRecommendationList", // 你可能喜欢的
    addMemberShareInfo: weiXinUrl + "shareActivity/addMemberShareInfo" , //记录分享群
    getMemberIsGroup: weiXinUrl + "groupBooking/getMemberIsGroup", //有没有团
    getShareTimes: weiXinUrl + "shareActivity/getShareTimes", //分享次数
    getShareCard: weiXinUrl + "shareActivity/getShareCard" , //领取分享的卡券
    getHomePageAdvertisement: weiXinUrl + "homepage/getHomePageAdvertisement", //首页提示框
    favoriteBySpuIdAndMemberIdForMini: weiXinUrl + "favorite/favoriteBySpuIdAndMemberIdForMini", //首页的收藏
    changeUrl: "https://api.cloudokids.cn/uploadsystem/makeWxImg/changeUrl", //获取参数
    addMemberAddressByWeiXin: weiXinUrl + "memberAddress/addMemberAddressByWeiXin", //从微信获取的地址添加
    createCelebrateCard: weiXinUrl + "card/createCelebrateCard", //店庆领取卡券
    shareRedPacket: weiXinUrl + "redPacket/shareRedPacket", //创建红包
    openRedPacket: weiXinUrl + "redPacket/openRedPacket", //拆红包
    memberIsFirstShareRedPacket: weiXinUrl + "redPacket/memberIsFirstShareRedPacket", //查用户今天创建过红包吗
    getRedPacketIsOpened: weiXinUrl + "redPacket/getRedPacketIsOpened", //用户拆没拆过这个红包
    getActiveFlag: weiXinUrl + "member/getActiveFlag", //有没有活动
    markCard: weiXinUrl + "card/markCard", //支付成功看看有没有送卡券活动
    getMemberHistory: weiXinUrl + "membership/getMemberHistory", //查看个人历程
    getProductRate: weiXinUrl + "membership/getProductRate", //详情页积分倍率
    getIsBindPhoneNum: weiXinUrl + "membership/getIsBindPhoneNum", //查看是否绑定手机号
    getMemberLevel: weiXinUrl + "membership/getMemberLevel", //用户会员信息
    insertBindPhoneNum: weiXinUrl + "membership/insertBindPhoneNum",//绑定手机号 
    getMemberGoodsRateListByTopicAndSpu: weiXinUrl + "membership/getMemberGoodsRateListByTopicAndSpu",//拉去列表会员信息 
  },
  onLaunch: function (options) {
    // 缓存手机信息
    wx.getSystemInfo({
      success: function (res) {
        wx.setStorageSync('phone', res);
      }
    });
    // 异步处理
    setTimeout(() => {
      req.analyticsLog({
        event: "laun",
        sce: options.scene,
      });
    })
  },
  onHide: function () {
  },
  globalData: {
    userInfo: null,
    isBind:false,
    three:true,
    channel: '6',
    activityId:'',
    version: '2.5.2'
  },
  goToH5(url) {
    if(url) url = encodeURIComponent(url)
    wx.navigateTo({
      url: `/pages/web/index?url=${url}`
    })
  },
  // 所有统计封装 非业务代码
  // analyApp: {
  //   // 浏览
  //   preview(data){
  //     req.analyticsLog({
  //       event: 'view',
  //       ...data
  //     });
  //   },
  //   // 事件
  //   event(event,data){
  //     req.analyticsLog({
  //       event,
  //       ...data
  //     });
  //   }
  // }
})