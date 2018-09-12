var app = getApp();
Page({
  data: {
    brand: [],
  },
  onShow: function () {
    var that = this;
    wx.request({
      url: app.api.getSpecialUrl,
      data: {
        specialId: 2011,
        pageNumber: 1,
        pageSize: 10,
      },
      success: function (data) {
        if (data.data.status == 2000) {
          that.setData({
            brand: data.data.data.datas
          })
          console.log(that.data.brand)
        }
      },
    })
  },
  go: function (e) {
    wx.navigateTo({
      url: '../detail/detail?spuId=' + e.currentTarget.dataset.id
    })
  },
  goindex: function (e) {
    wx.switchTab({
      url: '../home/index',
    })
  }
})