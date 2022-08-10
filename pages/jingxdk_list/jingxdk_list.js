// pages/archives/archives.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: ['全部', '正常', '异常'],
    demoPickerSource:[{id:1,text:'全部'},{id:1,text:'正常'},{id:1,text:'异常'},],
    type:'全部',
    st_date:'2021-12',
    en_date:'2021-12',
    list:[{
      title:'某某某某某科技有限公司',
      dm:'000000000000',
      hm:'0000000',
      se:'500.10',
      stutas:1,
      tjr:'张三',
      sj:'2021-11-18',
      yj:1
    },{
      title:'某某某某某科技有限公司',
      dm:'000000000000',
      hm:'0000000',
      se:'500.10',
      stutas:2,
      tjr:'张三',
      sj:'2021-11-18',
      yj:2
    }],
    triggered:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.picker1 = this.selectComponent("#picker"); 
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

  },
  showEventTypePicker() {
    this.picker1.showDatePicker()
  },

  // 隐藏 选择控件
  hiddeEventTypePicker() {
    this.picker1.hiddeDatePicker();
  },
  // demopicker 输出数据
  _confirmeventtype(e) {
    console.log("_confirmeventtype:", e, e.detail);
    this.setData({
      status: e.detail.text
    })
   // 操作完成后记得收起控件哦
    this.hiddeEventTypePicker()
  },
  stdate: function(e) {  //开始时间
    this.setData({
      st_date: e.detail.value.substring(0,7)
    })
  },
  endate(e){       //结束时间
    this.setData({
      en_date: e.detail.value.substring(0,7)
    })
  },
  choose_type(e){ //选择类型
    console.log( e.detail.value)
    var typeList=this.data.typeList;
    this.setData({
      type:typeList[ e.detail.value]
    })
   
  },
  jingxdk_del(){//详情
      wx.navigateTo({
        url: '/pages/jingxdk_del/jingxdk_del',
      })
  },
  onRefresh() {  //下拉刷新
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 3000)
  },
})