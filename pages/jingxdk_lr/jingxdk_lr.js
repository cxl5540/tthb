// pages/jingxdk_lr/jingxdk_lr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: ['全部', '正常', '异常'],
    type:'全部',
    st_date:'2021-12'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  choose_type(e){ //选择类型
    var typeList=this.data.typeList;
    this.setData({
      type:typeList[ e.detail.value]
    })
  },
  stdate: function(e) {  //开始时间
    this.setData({
      st_date: e.detail.value.substring(0,7)
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