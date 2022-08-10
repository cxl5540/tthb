// pages/buy_jg/buy_jg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numlist:[
      {n:'99元/500次',sale:'',checked:true},
      {n:'180元/1000次',sale:'',checked:false},
      {n:'350元/2000次',sale:'',checked:false},
      {n:'500元/3000次',sale:'优惠',checked:false},
      {n:'800元/5000次',sale:'优惠',checked:false},
      {n:'1500元/10000次',sale:'优惠',checked:false},
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  get_zsb(){ //获取正式版
    wx.navigateTo({
      url: '/pages/get_zsb/get_zsb',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})