import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    is_verification:0,
    page:1,
    pages:0,
    user_info:'',
    list:[],
    triggered:false,
    is_data:true,
    checkedall:false,
    tabHeiaght:400
  },
  onLoad: function (options) {
    this.setData({
      tabHeiaght:wx.getSystemInfoSync().windowHeight-36,
    })
    this.getlist()
  },
  getlist(){  //获取数据
    http.invoice_examine_list({
      data:{
        page:this.data.page,
        limit:10,
        uid:wx.getStorageSync('uid'),
      },
      success:res=>{
        if(res.code==200){
          var list=this.data.list;
         
          if(this.data.is_data){     
            this.setData({
              list:list.concat(res.data.invoice_list),
              user_info:res.data.user_info
            })
          }
          if(this.data.page>res.data.pages || res.data.pages<=1&&res.data.invoice_list.length<=10){
            this.setData({
              is_data:false
            })
          }
        }else{
          wx.showToast({
            title:res.msg,
            icon:'none'
          })
        }
      }
    })
  },
  detail(e){ //详情
    var id=e.currentTarget.dataset.id;
    var index=e.currentTarget.dataset.index;
    var is_verification=e.currentTarget.dataset.is_verification
    wx.navigateTo({
      url: '/pages/fapiao_dsh_del/fapiao_dsh_del?id='+id+'&index='+index+'&is_verification='+is_verification,
    })
  },
  givup(){ //
    util.showmodel('提示','放弃录入下次需重新导入，是否确定?').then(function (data) {
      if(data){
        wx.navigateBack()
      }
    })
  },
  allchcked(){ //全选
    let list=this.data.list;
    let checkedall=this.data.checkedall;
    if(!checkedall){
      for(var i=0;i<list.length;i++){
        list[i].checked=true;
      }
    }else{
      for(var i=0;i<list.length;i++){
        list[i].checked=false;
      }
    } 
    this.setData({
      list:list,
      checkedall:!checkedall
    })
  },
  radioval(e){ //单选
    let index = e.currentTarget.dataset.index;
    var list = this.data.list;
    list[index].checked=!list[index].checked;
    this.setData({
     list:list
    })
    let that = this;
    that.setData({
      checkedall: list.every(function(item) {
        return item.checked == true;
      }),
    })
  },
  pass(){ //通过
    let that=this;
    var str='';
    var Attr=[];
    let list=this.data.list;
    for(var i=0;i<list.length;i++){
      if(list[i].checked){
        str+=list[i].id+',';
        Attr.push(list[i].id);                                       
      }      
    }
    if(str){
      http.invoice_examine_adopt({
        data:{
         uid:wx.getStorageSync('uid'),
         invoice_ids:str.slice(0,str.length-1),
        },
        success:res=>{
           if(res.code==200){
             wx.showToast({
               title: res.msg,
             })
             for(var j=0;j<list.length;j++){
               for(var n=0;n<Attr.length;n++){
                 if(list[j].id==Attr[n]){             
                  list.splice(j,1);
                 }
               }                 
            }
            that.setData({
              list:list
            })
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
  no_pass(){  //不通过
    let that=this;
    var str='';
    var Attr=[];
    let list=this.data.list;
      for(var i=0;i<list.length;i++){
        if(list[i].checked){
          str+=list[i].id+',';
          Attr.push(list[i].id);                                       
        }      
      }
     if(str){
      wx.showModal({
        title: '编辑审核意见',
        placeholderText: '请输入审核意见',
        editable:true,
        success (res) {     
          if (res.confirm) {
             http.invoice_examine_reject({
               data:{
                uid:wx.getStorageSync('uid'),
                invoice_ids:str.slice(0,str.length-1),
                opinion:res.content
               },
               success:res=>{
                  if(res.code==200){
                    wx.showToast({
                      title: res.msg,
                    })
                    for(var j=0;j<list.length;j++){
                      for(var n=0;n<Attr.length;n++){
                        if(list[j].id==Attr[n]){             
                         list.splice(j,1);
                        }
                      }                 
                   }
                   that.setData({
                     list:list
                   })
                  }else{
                    wx.showToast({
                      title: res.msg,
                      icon:'none'
                    })
                  }
               }            
            })          
          } else if (res.cancel) {
      
          }
        }
      })
     }else{
      wx.showToast({
        title: '请选择发票',
        icon:'none'
      })
     } 
  },
  scrollToLower(e){ //上拉加载
    if(this.data.is_data){
      this.setData({
        page:this.data.page+1
      })
      this.getlist()
    }
    
  },
  onRefresh() {  //下拉刷新
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
        page:1,
        is_data:true,
        list:[],
      })
      this.getlist();
      this._freshing = false
    }, 2000)
  },
})