import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    typeList: ['全部', '未验真','正常', '异常'],
    is_verification:0,
    page:1,
    pages:0,
    user_info:'',
    key:'',
    input_time:'',
    type:'全部',
    st_date:'',
    en_date:'',
    list:[],
    triggered:false,
    is_data:true,
    checkedall:false,
    tabHeiaght:100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tabHeiaght:wx.getSystemInfoSync().windowHeight-132,
      input_time:util.formatTime(new Date()).substring(0,7)+' - '+util.formatTime(new Date()).substring(0,7),
      st_date:util.formatTime(new Date()).substring(0,7),
      en_date:util.formatTime(new Date()).substring(0,7)
    })
    this.getlist()
  },
  getlist(){
    http.voucher_no_list({
      data:{
        page:this.data.page,
        limit:10,
        uid:wx.getStorageSync('uid'),
        is_verification:this.data.is_verification,
        key:this.data.key,
        input_time:this.data.input_time
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
  submit(){
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
        title: '编辑凭证号',
        placeholderText: '请输入凭证号',
        editable:true,
        success (res) {     
          if (res.confirm) {
             http.voucher_no_record({
               data:{
                uid:wx.getStorageSync('uid'),
                year:that.data.st_date.substring(0,4),
                invoice_ids:str.slice(0,str.length-1),
                voucher:res.content
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
  stdate: function(e) {  //开始时间
    this.setData({
      st_date: e.detail.value.substring(0,7),
      input_time: e.detail.value.substring(0,7)+' - '+this.data.en_date,
      page:1,
      is_data:true,
      list:[]
    })
    this.getlist()   
  },
  endate(e){       //结束时间
    this.setData({
      en_date: e.detail.value.substring(0,7),
      input_time:this.data.st_date+' - '+e.detail.value.substring(0,7),
      page:1,
      is_data:true,
      list:[]
    })
    this.getlist()
  },
  keyval(e){ //关键词删选
    this.setData({
      key:e.detail.value,
    })
  },
  search(){ //搜索
    this.setData({
      page:1,
      is_data:true,
      list:[]
    })
    console.log(this.data.list)
    this.getlist();
  },
  choose_type(e){ //选择类型
    var typeList=this.data.typeList;
    this.setData({
      type:typeList[e.detail.value],
      is_verification:e.detail.value,
      page:1,
      is_data:true,
      list:[]
    })
   this.getlist()
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
        key:'',
        list:[],
        input_time:util.formatTime(new Date()).substring(0,7)+' - '+util.formatTime(new Date()).substring(0,7),
        st_date:util.formatTime(new Date()).substring(0,7),
        en_date:util.formatTime(new Date()).substring(0,7)
      })
      this.getlist();
      this._freshing = false
    }, 2000)
  },
  
})