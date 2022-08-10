import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
      zdcy:false,
      money:0,
      yj:false,
      pdf:false,
      photo:false,
      disable:true
  },
  switch1(){ //查验真伪
    var zdcy=this.data.zdcy;
    var disable=this.data.disable;
    this.setData({
      zdcy:!zdcy,
      disable:!disable,
    })
    this.team_runsetup();
  },
  switch2(){ //上传原件
    var yj=this.data.yj;
    this.setData({
      yj:!yj
    })
    if(!this.data.yj){
      this.setData({
        pdf:false
      })
    }
    this.team_runsetup();
  },
  switch3(){ //pdf
    if(this.data.yj){
      this.setData({
        pdf:!this.data.pdf
      })
      this.team_runsetup();
    }else{
      this.setData({
        pdf:false
      }) 
    }
   
  },
  switch4(){ //拍照
    this.setData({
      photo:!this.data.photo
    })
    this.team_runsetup()
  },
  inputWacth(e){
    this.setData({
      money:e.detail.value,
    })
  },
  submit(){//起始金额提交
    this.team_runsetup()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.team_setup() 
  },
  team_setup(){ //初始数据
    http.team_setup({
      data:{
        uid:wx.getStorageSync('uid')
      },
      success:res=>{
        if(res.code==200){
          this.setData({
            zdcy:res.data.team_info.is_automatic_verification==2?true:false,
            yj:res.data.team_info.is_invoice_script==2?true:false,
            pdf:res.data.team_info.is_pdf==2?true:false,
            photo:res.data.team_info.is_photograph==2?true:false,
            money:res.data.team_info.starting_amount
          })
          if(res.data.team_info.is_automatic_verification==2){
            this.setData({
              disable:false
            })
          }
        }
        
      }
    })
  },
  team_runsetup(){
    http.team_runsetup({
      data:{
        team_id:wx.getStorageSync('team_id'),
        uid:wx.getStorageSync('uid'),
        is_automatic_verification:this.data.zdcy==true?2:1,
        starting_amount:this.data.money,
        is_invoice_script:this.data.yj==true?2:1,
        is_pdf:this.data.pd==true?2:1,
        is_photograph:this.data.photo==true?2:1,
      },
      success:res=>{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })
    
  },
  
})