const req = require('../../utils/request');
const weApi = require('../../utils/weApis');
const pid = 44;
var app = getApp();
var list = [];
function addNum(m) { return m < 10 ? '0' + m : m }
function timeFormat(timestamp) {
  if (timestamp>0){
    let days = ~~(timestamp / 3600 / 24)
    let hours = ~~(timestamp / 3600 % 24);
    let minutes = ~~(timestamp / 60 % 60);
    let seconds = ~~(timestamp % 60);
    return addNum(hours) + ':' + addNum(minutes) + ':' + addNum(seconds);
  }else{
    return "00:00:00";
  }
}
var loadMore = function (that, orderStatus, pageNumber) {
  let token = wx.getStorageSync("token");
  let phonetype = wx.getStorageSync("phoneType");
  let pageSize = pageNumber;
  req.getGroupBookingOrder({
    token,
    phonetype,
    channel: 6,
    orderStatus,
    pageNumber,
    pageSize
  })
  .then(res => {
    if (res.data.status == 2013) {
      var newTitle = res.data.msg
      wx.showToast({
        title: newTitle,
      })
    }else {
      let { order, clock} = that.data;
      let addList  = res.data.data;
      for (var i = 0; i < res.data.data.length; i++) {
        clock.push(res.data.data[i].overPlusTime)
      }
      that.setData({
        order: [...order,...addList],
        totalPage: res.data.totalPage,
        pageNumber: that.data.pageNumber++,
        clock
      })
    }
  })
}
Page({
  data: {
    scrollTop: 0,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    token: "",
    phoneType: "",
    pageSize: 20,
    pageNumber: 1,
    orderStatus: 1,
    order: [],
    clock:[],
  },
  onLoad: function (options) {
    var that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    loadMore(that, that.data.orderStatus, that.data.pageNumber);
    this.timeDown()
    var current = options.currentTab;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          currentTab: current
        });
      }
    })
    req.analyticsLog({
      event: 'view',
      pid
    });
  },
  timeDown(options){
    var that = this;
    let timeOut = setInterval(function(){
      var clockDown = that.getData(that.data.clock)
      that.setData({ clockDown });      
    }.bind(this), 1000)
  },
  getData(timeArr) {
    let clockDown = [];
    for (let i = 0; i < timeArr.length; i++) {
      timeArr[i]--;
      clockDown.push(timeFormat(timeArr[i]))
    }
    return clockDown;
  },
  swichNav: function (e) {
    var that = this;
    this.setData({ clock: [] })
    let status = e.target.dataset.status;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        pageNumber: 1,
        order: [],
      })
      loadMore(that, status, that.data.pageNumber);
    }
  },
  goActivity(e) {
    let { activityId} =  e.currentTarget.dataset;
    let groupbookingtype = e.currentTarget.dataset.groupbookingtype;
    console.info(e)
    console.info(activityId)
    console.info(groupbookingtype)
    if (groupbookingtype == 6){
      wx.navigateTo({
        url: `../newStyleRoll/newStyleRoll?activityId=${activityId}`,
      })
    }
    if (groupbookingtype == 5){
      wx.navigateTo({
        url: `../detailPage/detailPage?path=${activityId}`+ `_` + groupbookingtype+ `_1`,
      })
    }
  },
  bindDownLoad: function () {
    var that = this;
    if (that.pageNumber < that.totalPage) loadMore(that, status, that.data.pageNumber);
  },
  orderInfo: function (e) {
    var orderId = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../collageDetail/collageDetail?orderId=' + orderId,
    })
  },
})
