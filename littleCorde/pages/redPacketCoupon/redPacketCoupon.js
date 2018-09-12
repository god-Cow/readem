Page({
  data: {
    windowWidth:0,
    windowHeight:0,
  },
  onLoad:function(){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      },
    })
  }
})