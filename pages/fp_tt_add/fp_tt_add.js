import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    formData:{
      name:'',register_num:'',address:'',bank:''
    }
  },
  inputWacth(e){
    let formData = this.data.formData;
    let item = e.currentTarget.dataset.model;
    formData[item] = e.detail.value;
    this.setData({
      formData
      }); 
  },
  submit(){
    if(!this.data.formData.name){
      wx.showToast({
        title: '请输入公司名称',
        icon:'none'
      })
    }else if(!this.data.formData.register_num){
      wx.showToast({
        title: '请输入信用代码',
        icon:'none'
      })
    }else{
      http.rise_runadd({
        data:{
          uid:wx.getStorageSync('uid'),
          team_id:wx.getStorageSync('team_id'),
          name:this.data.formData.name,
          register_num:this.data.formData.register_num,
          address:this.data.formData.address,
          bank:this.data.formData.bank,
        },
        success:res=>{         
          if(res.code==200){ 
            wx.showToast({
              title: res.msg,
            }) 
            var pages = getCurrentPages();
            var beforePage = pages[pages.length - 2];  
            setTimeout(res=>{
              beforePage.getlist();
              wx.navigateBack()
            },1000)                  
          }else{
            wx.showToast({
              title: res.msg,
              icon:'none'
            })
          }
        }
      })
    }
  },
})