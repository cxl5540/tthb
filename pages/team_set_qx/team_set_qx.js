import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    is_see:false,
    is_export:false,
    is_delete:false,
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var member_id=options.member_id;
    this.team_member_setup(member_id)
    this.setData({
      member_id:member_id
    })
  },
  team_member_setup(member_id){//初始数据
    http.team_member_setup({
      data:{
        member_id:member_id
      },
      success:res=>{
        if(res.code==200){
          this.setData({
            is_see:res.data.user_info.is_see==2?true:false,
            is_export:res.data.user_info.is_export==2?true:false,
            is_delete:res.data.user_info.is_delete==2?true:false,
          })
        }
        
      }
    })
  },
  team_member_runsetup(){
    http.team_member_runsetup({
      data:{
        member_id:this.data.member_id,
        is_see:this.data.is_see==true?2:1,
        is_export:this.data.is_export==true?2:1,
        is_delete:this.data.is_delete==true?2:1,
      },
      success:res=>{

      }
    })
  },
  switch1Change(e){
    this.setData({
      is_see:e.detail.value
    })
    this.team_member_runsetup()
  },
  switch2Change(e){
    this.setData({
      is_export:e.detail.value
    })
    this.team_member_runsetup()
  },
  switch3Change(e){
    this.setData({
      is_delete:e.detail.value
    })
    this.team_member_runsetup()
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