import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    show:false,
    id:'',
    commodity_info:'',
    activ:0,
    ac_item:'',
    address_info:'',
    disabled:false,
  },
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getdata(options.id)
  },
  getdata(id){  //获取数据   
    http.commodity_detail({
      data:{
        commodity_id:id,
        user_id:wx.getStorageSync('uid'),
      },
      success:res=>{
        if(res.code==200){
          res.data.commodity_info.detail =res.data.commodity_info.detail.replace(/\<img/gi, '<img class="richImg" ');
          this.setData({
            commodity_info:res.data.commodity_info,
            address_info:res.data.address_info,
            ac_item:res.data.commodity_info.relevance_list[0]
          })
        }else{
          wx.showToast({
            title:res.msg,
            icon:'none'
          })
        }
      }     
    })
  },
  addadress(){  //添加地址
    wx.navigateTo({
      url: '/pages/adress/adress',
    })
  },
  choosetype(e){
    var item=e.currentTarget.dataset.item;
    var index=e.currentTarget.dataset.index;
    if(item.inventory<=1){
      wx.showToast({
        title:'无库存',
        icon:'none'
      })
      return false
    }
    this.setData({
      activ:index,
      ac_item:item
    })
  },
  show_m(){
    this.setData({
      show:true
    })
  },
  onClose(){
    this.setData({
      show:false
    })
  },
  onSubmit(){
    var ac_item=this.data.ac_item;
    if(ac_item.inventory){
      http.unified_order({
        data:{
          relevance_id:ac_item.id,
          user_id:wx.getStorageSync('uid'),
        },
        success:res=>{
          if(res.code==200){
            if(ac_item.type==2){
              wx.showToast({
                title:res.msg,
                icon:'none'
              })
              setTimeout(res=>{
                wx.navigateBack()
              },2000)
            }else{
              this.doWxPay(res.data)
            }         
          }else{
            wx.showToast({
              title:res.msg,
              icon:'none'
            })
          }
        }     
      })
    }else{
      wx.showToast({
        title:'无库存',
        icon:'none'
      })
    }
  },
  doWxPay(pay_param) { //微信支付
    let that = this;
    var pay_param=pay_param;
    wx.requestPayment({
      timeStamp: pay_param.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错
      nonceStr:pay_param.nonceStr,
      package:pay_param.package,
      signType:"MD5",
      paySign:pay_param.paySign,
      success: function(event) {
        wx.showToast({
          title: '支付成功,请留意物流信息',
          icon: 'success',
          duration: 2000
        });
        setTimeout(res=>{
          wx.navigateBack()
        },2000)
        //支付成功
      },
      fail: function(error) {
        wx.showToast({
          title: '已取消',
          icon: 'none',
          duration: 2000,
        });
      },
      complete: function() {
        console.log("pay complete")
      }
    });
  },
})