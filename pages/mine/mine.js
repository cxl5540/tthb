// index.js
// 获取应用实例
import util from '../../utils/util.js';
import http from '../../utils/api.js';
const app = getApp()
//import util from "../../utils/util"
Page({
  data: {
    info:'',
    uid:'',
    show:false,
    user_info:'',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData:  wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    list:[
      {ti:'分享海报',url:'/pages/qrcode/qrcode'},
      {ti:'分享记录',url:'/pages/orderlist/orderlist?type=1'},
      {ti:'红包收益明细',url:'/pages/money_list/money_list?type=1'},
      {ti:'金币收益明细',url:'/pages/money_list/money_list?type=2'},  
      {ti:'商务合作',url:''},
      {ti:'编辑地址',url:'/pages/adress/adress'},
    ]
  },

  onLoad() {
  },
  onShow(){
    if(wx.getStorageSync('uid')){
        this.setData({
          uid:wx.getStorageSync('uid')
        });
        this.personal_info(wx.getStorageSync('uid'))
      }
  },
  personal_info(uid){//获取个人信息
    http.personal_info({
      data:{
        user_id:uid
      },
      success:res=>{
          if(res.code==200){
            this.setData({
                user_info:res.data.user_info
            });
            wx.setStorageSync('qrcode',res.data.user_info.qrcode);
          }
      }
    })
  },
  rules(){ //打开弹窗
    this.setData({
      show:true
    })
  },
  close(){//关闭弹窗
    this.setData({
      show:false
    })
  },
 
  navurl(e){ //跳转
    var url=e.currentTarget.dataset.url;
    if(url){
      wx.navigateTo({
        url: url,
      })
    }  
  },
 
  getUserProfile(e){ //授权
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        util.login(res.encryptedData,res.iv);
        util.checkLoginReadyCallback = res => {
          this.setData({
            uid: res,
          })
          this.personal_info(res)
        }               
      }
    })
  },
  getPhoneNumber: function (e) {  //电话授权
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: app.globalData.url,
        data: {
          action: 'Login/empower_mobile',
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          uid: this.data.uid,
        },
        method: "post",
        success: function (res) {
          if(res.data.code=='200'){
            wx.showToast({
              title: res.data.msg,
              duration: 2000,
              icon: 'success',
            });
            wx.setStorageSync('tel', res.data.data.tel);
            console.log(res.data.data.tel)
            that.setData({
              tel:res.data.data.tel,
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              duration: 2000,
              icon: 'none',
            });
          }        
        },
        complete:function(){
          wx.hideLoading();
        }
      })
    }
  },
  cl_fun(){
     util.showmodel('11','333').then(function(data){
       console.log(data)
     })
   
  }
})
