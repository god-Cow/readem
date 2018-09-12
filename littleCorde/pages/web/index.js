const app = getApp();
const version = ~~(+ new Date / 1000 / 60 / 5); //去缓存

Page({
  name: 'web',
  data: {
    url: ``
  },
  onLoad(options) {
    const url = decodeURIComponent(options.url) + '?' + version;
    this.setData({
      url
    });
    console.log(url)
  },
  onShow(){
    console.log('onshow');
    //this.onLoad();
  },
  eventHandler(e) {
    console.log(e.detail.data);
  }
})
