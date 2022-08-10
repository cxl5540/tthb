// pages/kj_yaoqm/kj_yaoqm.js
Page({
  data: {
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      code:options.cw
    })
  },
  clickImg(){
    wx.previewImage({
      current:'',
      urls: ['https://tzzs.toommi.com/data/upload/config/tz1.png']
    })
    },
  
})