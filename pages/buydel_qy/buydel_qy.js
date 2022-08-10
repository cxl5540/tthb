import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    id:'',
    info:''
  },
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getdata(options.id)
  },
  getdata(id){
    http.order_detail({
      data:{
        order_id:id
      },
      success:res=>{
        if(res.code==200){
          this.setData({
            info:res.data.order_info
          })
        }
      }
    })
  },
  kefu(){
    app.kefu()
  }
})