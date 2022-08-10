import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    list:'',
    rise_id:'',
    name:'',
    d_name:'',
  },

  onLoad: function (options) {
    var rise_id=options.rise_id;
    var name=options.name;
    this.setData({
      rise_id:rise_id,
      name:name
    })
    this.getlist(rise_id)
  },
  department_name(e){
    var d_name=e.detail.value;
    this.setData({
      d_name:d_name
    })
  },
  add(){ //新增
    if(!this.data.d_name){
      wx.showToast({
        title: '请输入部门名称',
        icon:'none'
      })
    }else{
      http.department_runadd({
        data:{
          rise_id:this.data.rise_id,
          uid:wx.getStorageSync('uid'),
          name:this.data.d_name
        },
        success:res=>{
          if(res.code==200){
            wx.showToast({
              title: res.msg,
            })
            setTimeout(res=>{
              this.getlist(this.data.rise_id)
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
        http.department_del({
          data:{
            department_id:id
          },
          success:res=>{
            if(res.code==200){
              var list=this.data.list;
              list.splice(index,1);
              this.setData({
                list:list
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
  },
  getlist(rise_id){ //获取列表
    http.department_list({
      data:{
        rise_id:rise_id
      },
      success:res=>{
        if(res.code==200){
          this.setData({
            list:res.data
          })
        }
      }
    })
  },
  people_list(){
    // wx.navigateTo({
    //   url: '/pages/fp_tt_people/fp_tt_people',
    // })
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
})