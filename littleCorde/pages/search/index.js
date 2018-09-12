var WxSearch = require('../../wxSearch/wxSearch.js')
var app = getApp()
Page({
  data: {
  },
  onLoad: function () {
    var that = this
    WxSearch.init(that,43,['上衣','裙子','AKID','童鞋','运动裤']);
    // WxSearch.initMindKeys(['','微信小程序开发','微信开发','微信小程序']);
  },
  wxSearchFn: function(e){
    var that = this
    WxSearch.wxSearchAddHisKey(that);
    var queryString = that.data.wxSearchData.value;
    if (queryString != "" && queryString != null){
      wx.navigateTo({
        url: '../newStyle/newStyle?queryString=' + queryString + '&pageCome=5',
      })
    }
  },
  wxSearchInput: function(e){
    var that = this;
    WxSearch.wxSearchInput(e,that);
  },
  wxSerchFocus: function(e){
    var that = this
    WxSearch.wxSearchFocus(e,that);
  },
  wxSearchBlur: function(e){
    var that = this
    WxSearch.wxSearchBlur(e,that);
  },
  wxSearchKeyTap:function(e){
    var that = this
    WxSearch.wxSearchKeyTap(e,that);
  },
  wxSearchDeleteKey: function(e){
    var that = this
    WxSearch.wxSearchDeleteKey(e,that);
  },
  wxSearchDeleteAll: function(e){
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function(e){
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
   onReady: function () {
    wx.setNavigationBarTitle({
      title: '搜索'
    })
  },
})
