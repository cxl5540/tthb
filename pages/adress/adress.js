import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    region: [],// 选中的数据
    formData:{
      name:'',
      tel:'',
      adress:''
    }
  },
  onLoad: function (options) {
    this.getinfo()
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  getinfo(){
    http.address_edit({
      data:{
        user_id:wx.getStorageSync('uid'),
      },
      success:res=>{
        if(res.code==200){
          if(res.data.address_info){
            this.setData({
              'formData.name':res.data.address_info.recipients,
              'formData.tel':res.data.address_info.tel,
              'formData.adress':res.data.address_info.detail_address,
               region:res.data.address_info.region.split('-'),
            })
          }          
        }
      }
    })
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
    console.log(this.data.formData)
    if(!this.data.formData.name){
      wx.showToast({
        title: '请输入收件人',
        icon:'none'
      })
    }else if(!this.data.formData.tel){
      wx.showToast({
        title: '请输入手机号',
        icon:'none'
      })
    }else if(!this.data.region.length){
      wx.showToast({
        title: '请选择省市区',
        icon:'none'
      })
    }else if(!this.data.formData.adress){
      wx.showToast({
        title: '请输入详细地址',
        icon:'none'
      })
    }else{
      http.address_runedit({
        data:{
          user_id:wx.getStorageSync('uid'),
          region:this.data.region[0]+'-'+this.data.region[1]+'-'+this.data.region[2],
          detail_address:this.data.formData.adress,
          recipients:this.data.formData.name,
          tel:this.data.formData.tel,
        },
        success:res=>{         
          if(res.code==200){ 
            wx.showToast({
              title: res.msg,
            })  
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            console.log(pages);
            if(prevPage.route=='pages/goods_del/goods_del')
            prevPage.setData({
              address_info:res.data.address_info
            })  
            setTimeout(res=>{
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