const app = getApp()
const req = require('../../utils/request');
const weApi = require('../../utils/weApis');
const pid = 14;

var loadMore = function (that) {
  wx.request({
    url: app.api.myOrder,
    data: {
      token: that.data.token,
      phonetype: that.data.phoneType,
      orderStatus: parseInt(that.data.currentTab) + parseInt(1),
      pageSize: that.data.pageSize,
      pageNumber: that.data.pageNumber,
      channel: 6
    },
    header: {
      'content-type': 'application/json'
    },
    method: "GET",
    success: function (res) {
      if (res.data.status == 2000) {
        var list = that.data.order;
        for (var i = 0; i < res.data.data.datas.length; i++) {
          list.push(res.data.data.datas[i]);
        }
        that.setData({
          order: list,
        })
        that.data.pageNumber++;
      }
      if(res.data.status == 2013){
        var newTitle = res.data.msg
        wx.showToast({
          title: newTitle,
        })
        wx.clearStorage();
      }
    },
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
    order: [],
  },
  onLoad: function (options) {
    var current = options.currentTab;
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          currentTab: current
        });
      }
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: res.data,
        })
        wx.getStorage({
          key: 'phoneType',
          success: function (res) {
            that.setData({
              phoneType: res.data,
            })
            loadMore(that);
          },
        })
      },
    })
    req.analyticsLog({
      event: 'view',
      pid
    })
  },
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
      pageNumber: 1,
      order: [],
    });
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: res.data,
        })
        wx.getStorage({
          key: 'phoneType',
          success: function (res) {
            that.setData({
              phoneType: res.data,
            })
            loadMore(that);
          },
        })
      },
    })
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        pageNumber: 1,
        order: [],
      })
      loadMore(that);
    }
  },
  bindDownLoad: function () {
    var that = this;
    loadMore(that);
  },
  orderInfo:function(e){
    var orderId = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../../pages/orderInfo/orderInfo?orderId=' + orderId,
    })
  },
})
