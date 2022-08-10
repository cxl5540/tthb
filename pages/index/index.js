// index.js
// 获取应用实例
import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
      uid:'',
    imgList:[
     {url:"banner.png",id:1},
    ],
    list:[],
    show:false,
  },
  // 事件处理函数
  bindViewTap() {
  },
  show(){
    this.setData({
      show:true
    })
  },
  close(){
    this.setData({
      show:false
    })
  },
  onLoad(options) {
    if (options.scene) {  
      let obj = decodeURIComponent(options.scene);
      var promoter_id =obj.split("=")[1];
      wx.setStorageSync('promoter_id',promoter_id);  
    }
    this.home_info()
  },
  onShow() {
    if(wx.getStorageSync('uid')){
        this.setData({
          uid:wx.getStorageSync('uid')
        });
        this.home_info()
      }
  },
  home_info(uid){//获取首页信息
    http.home_info({
      data:{},
      success:res=>{
        this.setData({
         list:res.data.log_list
        });
      }
    })
  },
  get_verify(e){//验证 //看广告
    var type=e.currentTarget.dataset.type;
    http.get_verify({
      data:{
        user_id:wx.getStorageSync('uid'),
      },
      success:res=>{
         if(res.code==200){
             var red_packet_status=res.data.red_packet_status;
             var gold_status=res.data.gold_status;
             if(type==1){
                 if(red_packet_status){
                    wx.navigateTo({
                        url: '/pages/look_ad/look_ad?type=1',
                      })
                 }else{
                  wx.showModal({
                    title: '提示',
                    content: res.data.red_packet_mag,
                    showCancel: false,
                    success (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      }
                    }
                  })
                 }
             }else{
                if(gold_status){
                    wx.navigateTo({
                        url: '/pages/look_ad/look_ad?type=2',
                      })
                 }else{
                  wx.showModal({
                    title: '提示',
                    content:res.data.gold_mag,
                    showCancel: false,
                    success (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      }
                    }
                  })
                 }
             }
         }
      }
    })
  },
  cl_fun(){
     util.showmodel('11','333').then(function(data){
       //console.log(data)
     })  
  },

  getUserProfile(e){ //授权
    wx.getUserProfile({
      desc: '用于完善资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        util.login(res.encryptedData,res.iv)
        util.checkLoginReadyCallback = res => {
          this.setData({
            uid: res,
          })
          this.home_info(res)
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
            //console.log(res.data.data.tel)
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
})
