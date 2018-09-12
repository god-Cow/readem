Page({
  data: {
    expressSn:""
  },
  onLoad:function(options){
    var that = this;
    that.setData({
      expressSn: options.expressSn
    })
  }
})