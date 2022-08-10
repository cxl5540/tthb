import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    cost_list:'',
    admin_id:'',
    name:''
  },
  onLoad: function (options) {
    this.getlist()
  },
  getlist(){ //获取列表
    http.cost_list({
      data:{
        uid:wx.getStorageSync('uid')
      },
      success:res=>{
        if(res.code==200){
          this.setData({
            cost_list:res.data.cost_list,
            admin_id:res.data.admin_id
          })
        }
      }
    })
  },
  getname(e){
    var name=e.detail.value;
    this.setData({
      name:name
    })
  },
  add(){ //新增
    console.log(1)
    if(!this.data.name){
      wx.showToast({
        title: '请输入费用类型名称',
        icon:'none'
      })
    }else{
      http.cost_runadd({
        data:{
          uid:wx.getStorageSync('uid'),
          name:this.data.name
        },
        success:res=>{
          if(res.code==200){
            wx.showToast({
              title: res.msg,
            })
            setTimeout(res=>{
              this.getlist()
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
  del(e){ //删除
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let that=this;
    util.showmodel('提示','是否确定删除？').then(data=>{
      if(data){
        http.cost_del({
          data:{
            cost_id:id
          },
          success:res=>{
            if(res.code==200){
              var list=this.data.cost_list;
              list.splice(index,1);
              this.setData({
                cost_list:list
              })
            }else{
              wx.showToast({
                title: res.msg,
                icon:none
              })
            }
          }
        })
      }
    })
  }
})