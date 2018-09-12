var app = getApp();
const req = require("../../utils/request.js")
const weApi = require('../../utils/weApis.js');
const pid = 9;

Page({
  data: {
  },
  onLoad: function (options) {
    var brandId = options.brandId;
    var that = this;
    wx.request({
      url: app.api.getBrandSizeByBrandId,
      data:{
        brandId: brandId
      },
      method:"GET",
      header:{
        "content-type":"application/json"
      },
      success:function(res){
        if(res.data.status == 2000){
          var data = res.data.data;
          if (data != null && data !="" || data != undefined){
            var newData = data.size;
            var WxParse = require('../../wxParse/wxParse.js');
            WxParse.wxParse('newData', 'html', newData, that, 0);
          }else{
            wx.showToast({
              title: '该商品暂无尺码对照表',
            })
          }
        }
      }
    })
  },
})