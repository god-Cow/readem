var app = getApp();
Page({
  data: {
    token:"",
    phoneType:"",
    orderSn:""
  },
  onLoad:function(options){
    var that = this;
    var path = options.path;
    console.info(path)
    that.setData({
      orderSn: path.split("_")[1],
      groupId: path.split("_")[0],
      token: wx.getStorageSync("token"),
      phoneType: wx.getStorageSync("phoneType")
    })
    wx.request({
      url: app.api.getOrderParcelInfoByOrderSn,
      data: {
        orderSn: that.data.orderSn,
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6"
      },
      header: {
        "content-type": "application/json"
      },
      method: "GET",
      success: function (data) {
        console.info(data)
        if (data.data.status == 2000) {
          that.setData({
            orderShop: data.data.data
          })
        }
      }
    })
    wx.request({
      url: app.api.getOrderByMemberIdOrderSn,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        orderSn: that.data.orderSn,
        channel: 6
      },
      header: {
        "content-type": "application/json"
      },
      method: "GET",
      success: function (newData) {
        console.info(newData)
        if (newData.data.status == 2000) {
          that.setData({
            orderInfo: newData.data.data
          })
        }
      }
    })
    wx.request({
      url: app.api.getGroupInfo,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6",
        groupId: that.data.groupId,
        activeId: "",
        groupType: "4",
        activeStatus: "1",
      },
      dataType: "json",
      method: "GET",
      success: function (data) {
        console.info(data)
        if (data.data.status == 2000) {
          that.setData({
            groupStatusVo: data.data.data.groupStatusVo
          })
          that.getData()
        }
      }
    })
  },
  goIndex:function(){
    var that = this;
    wx.switchTab({
      url: '../home/index',
      success:function(){
        var page = getCurrentPages().pop();
        if(page == undefined || page == null) return;
        page.onLoad()
      }
    })
  }
})