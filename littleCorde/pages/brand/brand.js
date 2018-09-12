var app = getApp()
Page({
  data:{
    brand:[],
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: app.api.getBrand,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          brand:res.data.data
        });
      }
    })
  },
  goBrandList:function(e){
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
})
