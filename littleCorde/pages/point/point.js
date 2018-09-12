const app = getApp()
const req = require('../../utils/request');
const weApi = require('../../utils/weApis');
const pid = 19;

var loadMore = function (that) {
  wx.request({
    url: app.api.getMemberPointLog,
    data: {
      token: that.data.token,
      phonetype: that.data.phoneType,
      channel: 6,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    },
    header: {
      "content-type": "application/json"
    },
    method: "GET",
    success: function (data) {
      if (data.data.status == 2000) {
        for (var i = 0; i < data.data.data.memberPointLogList.datas.length; i++) {
          that.data.point.push({
            tips: data.data.data.memberPointLogList.datas[i].note,
            changePoint: data.data.data.memberPointLogList.datas[i].changePoint,
            createTime: data.data.data.memberPointLogList.datas[i].createTime,
            historyPoint: data.data.data.memberPointLogList.datas[i].historyPoint
          })
        }
        that.setData({
          point: that.data.point
        });
        that.data.pageNumber++;
      }
    }
  })
}
Page({
  data: {
    token:"",
    phoneType:"",
    scrollTop: 0,
    scrollHeight: 0,
    point:[],
    hidden: true,
    pageNumber:1,
    pageSize:20
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token:res.data
        })
        wx.getStorage({
          key: 'phoneType',
          success: function(result) {
            that.setData({
              phoneType: result.data
            })
            loadMore(that);
          },
        })
      },
    })
    req.analyticsLog({
      event: 'view',
      pid
    });
  },
  bindDownLoad: function () {
    var that = this;
    loadMore(that);
  },
})