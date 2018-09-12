const app = getApp()
const req = require('../../utils/request');
const weApi = require('../../utils/weApis');
const pid = 2;

Page({
  data: {
    classifyActive1:true,
    classifyActive2:false,
    windowHeight: 0,
    brand: [],
    getCategorySales:[],
  },
  onLoad:function(){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })
    that.getBrandListInfo()
    wx.request({
      url: app.api.getCategorySales,
      data: {
        version: "10000."
      },
      header: {
        "content-type": "application/json"
      },
      method: "GET",
      success: function (res) {
        if (res.data.status == 2000) {
          for (var i = 0; i < res.data.data.length; i++) {
            that.data.getCategorySales.push({
              id: res.data.data[i].id,
              childData: res.data.data[i].childData,
              name: res.data.data[i].name,
              specialId: res.data.data[i].specialId,
              topicId: res.data.data[i].topicId,
              type: res.data.data[i].type,
              display: "none"
            })
          }
          that.setData({
            getCategorySales: that.data.getCategorySales
          })
        }
      }
    })
  },
  onShow:function(){
    var that = this;
    req.analyticsLog({
      event: 'view',
      pid: pid + '-' + (that.data.classifyActive1 ? 0 : 1)
    })
  },
  changeClassify: function (e) {
    var that = this;
    switch (e.currentTarget.dataset.id) {
      case "1":
        that.setData({
          classifyActive1: true,
          classifyActive2: false,
        })
        break;
      case "2":
        that.setData({
          classifyActive1: false,
          classifyActive2: true,
        })
        break;
    }
    req.analyticsLog({
      event: 'view',
      pid: pid + '-' + (that.data.classifyActive1 ? 0 : 1)
    })
  },
  getBrandListInfo:function(){
    var that = this;
    wx.request({
      url: app.api.getBrand,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          brand: res.data.data
        });
      }
    })
  },
  goSpecial: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../newStyle/newStyle?specialId=' + e.currentTarget.dataset.id + "&pageCome=" + e.currentTarget.dataset.uid + "&title=" + e.currentTarget.dataset.title,
    })
  },
  goDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?spuId=' + e.currentTarget.dataset.id
    })
  },
  goBrandList: function (e) {
    var specialId = e.currentTarget.dataset.id;
    var titleName = e.currentTarget.dataset.title;
    var title = titleName.replace("&", "!")
    wx.navigateTo({
      url: '../newStyle/newStyle?specialId=' + specialId + '&title=' + title + '&pageCome=3',
    })
  },
  scrollToViewFn: function (e) {
    var _id = e.target.dataset.id;
    this.setData({
      toView: 'inToView' + _id
    })
  }, 
  effect: function (e) {
    var that = this;
    var categoryFlag = e.currentTarget.dataset.flag;
    var id = e.currentTarget.dataset.id;
    if (categoryFlag == "none") {
      for (var i = 0; i < that.data.getCategorySales.length; i++) {
        if (that.data.getCategorySales[i].id == id) {
          that.data.getCategorySales[i].display = "block"
        } else {
          that.data.getCategorySales[i].display = "none"
        }
      }
    } else {
      for (var i = 0; i < that.data.getCategorySales.length; i++) {
        if (that.data.getCategorySales[i].id == id) {
          that.data.getCategorySales[i].display = "none"
        } else {
          that.data.getCategorySales[i].display = "none"
        }
      }
    }
    that.setData({
      getCategorySales: that.data.getCategorySales
    })
  },
})