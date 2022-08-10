// pages/pc_set/pc_set.js
import util from '../../utils/util.js';
import http from '../../utils/api.js';
const app = getApp()
Page({
  data: {
    name:'',
    password:'',
    tel:'',
    url:'https://tzzs.toommi.com'
  },
  onLoad(options){
    this.setData({
      tel:options.tel,
      name:options.name
    }) 
  },
  name(e){
    this.setData({
      name:e.detail.value,
     
    })
  },
  password(e){
    this.setData({
      password:e.detail.value
    })
  },
  check(){
    if(!this.data.name){
      this.data.title='请输入个人名字'      
      return false;
    }else if(!this.data.password){
      this.data.title='请输入登录密码';
      return false;
    }else{
      return true;
    }
  },
  getbuy(){
    wx.navigateTo({
      url: '/pages/get_zsb/get_zsb',
    })
  },
  submit(){ //提交
    if(this.check()){
      http.user_info_edit({
        data:{
          uid:wx.getStorageSync('uid'),
          name:this.data.name,
          password:this.data.password,
          team_name:'',
        },
        success:res=>{
          if(res.code==200){ 
            const pages = getCurrentPages()
            const prevPage = pages[pages.length-2] // 上一页// 调用上一个页面的setData 方法，将数据存储
            prevPage.setData({
            'info.name':this.data.name
            })                     
            wx.showToast({
              title: res.msg,
              success:function(){
                setTimeout(
                  function(params) {
                    wx.navigateBack()
                },1000)              
              }
            })
          }else{
            wx.showToast({
              title: res.msg,
              icon:'none'
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: this.data.title,
        icon:'none'
      })
    }
  },
  copy(){
    util.copy(this.data.url)
  },
})