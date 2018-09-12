var app = getApp();
const req = require('../../utils/request.js')
const weApi = require('../../utils/weApis.js')
const pid = 24;

var loadMore = function (that) {
  wx.request({
    url: app.api.getFavorite,
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
        if(data.data.data == false){

        }else{
          that.setData({
            display:"none",
          })
          for (var i = 0; i < data.data.data.datas.length; i++) {
            that.data.collect.push({
              spuId: data.data.data.datas[i].spuId,
              img: data.data.data.datas[i].img
            })
          }
          that.setData({
            collect: that.data.collect
          });
          that.data.pageNumber++;
        }
       
      }
    }
  })
}
Page({
  data: {
    token: "",
    phoneType: "",
    scrollTop: 0,
    scrollHeight: 0,
    collect: [],
    hidden: true,
    pageNumber:1,
    pageSize:20,
    display:"block",
  },
  onShow: function (options) {
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
      success: function (res) {
        that.setData({
          token: res.data
        })
        wx.getStorage({
          key: 'phoneType',
          success: function (result) {
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