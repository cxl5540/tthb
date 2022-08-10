import util from '../../utils/util.js'
import http from '../../utils/api'
Page({
  data: {
    tabs: [],
    activeTab:0,
    team_id:'',
    tabHeiaght:0,
    kj_num:1,
    yg_num:10,
    min_kj:'',
    min_yg:'',
    sm:true,
    sm_show:true,
    ocr:false,
    ocr_show:true,
    is_open_ocr:'',
    is_open_pc:'',
    time:1,
    pay:[0,0,0],
    yz_num:0,
    is_vip:'',
    formData:{
      receiving_address:'',receiving_people:'',receiving_tel:''
    },
    smq:[
      {num:1,money:199,checked:false},
      {num:1,money:499,checked:false},
    ],
    type:'',
    items: [
      {value: '1', name: '1年' , checked:true},
      {value: '2', name: '2年', checked:false},
      {value: '3', name: '3年', checked:false},
    ],
    qy_checked:[
      {val:'495',y_val:'990',checked:true,type:4,qy_kj_num:5,qy_yg_num:50,cycs:2000},
      {val:'1990',y_val:'2590',checked:false,type:5,qy_kj_num:10,qy_yg_num:100,cycs:10000},
      {val:'8990',y_val:'13800',checked:false,type:6,qy_kj_num:30,qy_yg_num:99999,cycs:99999},
    ],
    qy_item:'',
    qy_kj_num:'',
    qy_yg_num:'',
    numlist:[
      {n:'100元/500次',money:'100',yz_num:500, sale:'',checked:false},
      {n:'200元/1000次',money:'200',yz_num:1000,sale:'',checked:false},
      {n:'500元/2750次',money:'500',yz_num:2750,sale:'',checked:false},
      {n:'800元/4500次',money:'800',yz_num:4500,sale:'优惠',checked:false},
      {n:'1000元/6000次',money:'1000',yz_num:6000,sale:'优惠',checked:false},
    ],
    list:[
      {o:'类型',t:'普通版',th:'会员版'},
      {o:'会计数',t:'1人',th:'最多10人'},
      {o:'员工数',t:'10人',th:'按需购买'},
      {o:'真伪查验',t:'0次',th:'按需购买'},
      {o:'OCR识别',t:'0次',th:'按需购买'},
      {o:'扫码权限',t:'无',th:'按需购买'},
      {o:'录入次数',t:'5次',th:'无限次/月'},
      {o:'查重次数',t:'5次',th:'无限次/月'},
      {o:'时长',t:'永久',th:'购买时长'},
    ],
    qylist:[
      {o:'套餐',t:'企业套餐',th:'尊享套餐',f:'不限量套餐'},
      {o:'年费',t:'¥990',th:'¥2590',f:'¥13800'},
      {o:'会计数',t:'5人',th:'10人',f:'30人'},
      {o:'员工数',t:'50人',th:'100人',f:'不限'},
      {o:'真伪查验',t:'1500次',th:'10000次',f:'不限'},
    ]
  },
  onLoad: function (options) {
    const titles = ['会员购买', '企业版套餐', '扫码器购买']
    const tabs = titles.map(item => ({title: item}))
    this.setData({tabs});
    this.setTableHeight();
    this.getinfo();  
  },
  getinfo(){ //获取基础信息
    http.order_info({
      data:{
        uid:wx.getStorageSync('uid')
      },
      success:res=>{
        var min_yg=res.data.staff_count;
        if(min_yg<=10){
           min_yg=10;
        }else{
          var str=min_yg.toString();
              str=str.charAt(str.length-1);
          if(str!=='0'){
            min_yg=min_yg-Number(str)+10
          }else{
            min_yg=min_yg
          }         
        }
        this.setData({
          is_vip:res.data.is_vip,
          kj_num:res.data.finance_count,
          yg_num:min_yg,
          min_kj:res.data.finance_count==0?1:res.data.finance_count,
          min_yg:min_yg,
          is_open_pc:res.data.is_open_pc,
          is_open_ocr:res.data.is_open_ocr,
          team_id:res.data.team_id,
          'pay[0]':(res.data.finance_count*99+min_yg*6-60)*1+150
        }) 
        // this.getmoney();     
        if(res.data.is_vip==4||res.data.is_vip==5||res.data.is_vip==6){
          this.setData({
            'pay[1]':this.data.qy_checked[0].val
          })
        }else{
          this.setData({
            'pay[1]':this.data.qy_checked[0].y_val,
            qy_yg_num:this.data.qy_checked[0].qy_yg_num,
            qy_kj_num:this.data.qy_checked[0].qy_kj_num,
            type:this.data.qy_checked[0].type,
            qy_item:this.data.qy_checked[0]
          })
        }
      }
      
    });  
  
  },
  getmoney(){ //合计
    var yg_num=this.data.yg_num;
    var kj_num=this.data.kj_num;
    var time=this.data.time;
    var sm=this.data.sm;
    var ocr=this.data.ocr;
    var pay=0;
    if(!sm&&!ocr){
      pay=(kj_num*99+yg_num*6-60)*time
    }else if(!sm&&ocr||!ocr&&sm){
      pay=(kj_num*99+yg_num*6-60)*time+150
    }else{
      pay=(kj_num*99+yg_num*6-60)*time+300
    }
    for(var i=0;i<this.data.numlist.length;i++){
      if(this.data.numlist[i].checked){
        pay=pay+Number(this.data.numlist[i].money);
      }
    }
    this.setData({
      'pay[0]':pay
    })
  },
  smq_check(e){  //选择扫码器
    var type=e.currentTarget.dataset.type;
    var smq=this.data.smq;
    if(type==1){
      this.setData({
        'smq[0].checked':!smq[0].checked
      })
    }else{
      this.setData({
        'smq[1].checked':!smq[1].checked
      })
    }
    this.getmoney_smq()
  },
  getmoney_smq(){  //扫码器钱
    var smq=this.data.smq;
    var attr=[];
    for(var i=0;i<smq.length;i++){
      if(smq[i].checked==true){
        attr.push(smq[i].money)
      }
    }
    if(attr.length==1){
      this.setData({
        'pay[2]':attr[0]*smq[0].num
      })
    }else if(attr.length==2){
      this.setData({
        'pay[2]':attr[0]*smq[0].num+attr[1]*smq[1].num
      }) 
    }else{
      this.setData({
        'pay[2]':0
      }) 
    }
  },
  inputWacth(e){//选择扫码器
    let formData = this.data.formData;
    let item = e.currentTarget.dataset.model;
    formData[item] = e.detail.value;
    this.setData({
      formData
      });
  },
  Change_smq(e){ //选择扫码器
    var smq=this.data.smq;
    var type=e.currentTarget.dataset.type;
    if(type==1){
      this.setData({
        'smq[0].num':e.detail
      })
    }else{
      this.setData({
        'smq[1].num':e.detail
      })
    }
    this.getmoney_smq()
  },
  sm_money(){ //扫码模块  
    this.setData({
      sm:!this.data.sm
    })
    this.getmoney()
  },
  ocy_money(){//ocr模块
    this.setData({
      ocr:!this.data.ocr
    })
    this.getmoney()
  },
   onChange_kj(event) { //会计个数   
      if(event.detail>10){
        wx.showToast({
          title: '会员版会计数最多添加10人',
          icon:'none'
        })
      }else if(event.detail<this.data.min_kj){
        wx.showToast({
          title: '购买个数不低于'+this.data.min_kj+'个',
          icon:'none'
        })
      }else{
        this.setData({
          kj_num:event.detail,
        })
        this.getmoney()
      }
  }, 
  tip_kj(e){ //会计个数提示
    wx.showToast({
      title: '购买个数不低于'+this.data.min_kj+'个',
      icon:'none'
    })
  },
  tip_yg(e){ //员工个数提示
    wx.showToast({
      title: '购买个数不低于'+this.data.min_yg+'个',
      icon:'none'
    })
  },
  onChange_yg(event) { //员工个数
    this.setData({
        yg_num:event.detail,
    })
    this.getmoney() 
  },
  set_ygnum(e){ //限制员工操作
    if(e.detail % 10 == 0){
      this.setData({
        yg_num:e.detail.value,
      })
      this.getmoney()
    }else{
      this.setData({
        yg_num:10,
      })
      this.getmoney()
      wx.showToast({
        title: '员工个数为10的倍数且不低于'+this.data.min_yg+'个',
        icon:'none'
      })
    }
  },
  radioChange(e){//选择时长
    var value=e.detail.value;
    this.setData({
      time:value,     
    });
    this.getmoney()
  },
  qy_check(e){ //企业套餐
    var item=e.currentTarget.dataset.value;
    var index=e.currentTarget.dataset.index;
    var qy_checked=this.data.qy_checked;
     for(let i in qy_checked){
       qy_checked[i].checked=false;    
     }
     qy_checked[index].checked=true;
     this.setData({
      qy_checked:qy_checked,
      type:item.type,
      qy_kj_num:item.qy_kj_num,
      qy_yg_num:item.qy_yg_num,
      qy_item:item  
     })
     if(this.data.is_vip==4||this.data.is_vip==5||this.data.is_vip==6){
       this.setData({
        'pay[1]':item.val
       })
     }else{
      this.setData({
        'pay[1]':item.y_val
       })
     }
  },


  change_num(e){ //选择查验次数
    var item=e.currentTarget.dataset.item;
    var index=e.currentTarget.dataset.index;
    var money=item.money;
    var numlist=this.data.numlist;
    for(let it in numlist){
      if(it==index){    
        numlist[index].checked=!numlist[index].checked;
      }else{
        numlist[it].checked=false;
      }
    }
    this.setData({
      numlist:numlist,
      yz_num:item.yz_num
    })
    this.getmoney()
  },
  payorder(){ //立即下单
    var activeTab=this.data.activeTab;
    var data='';
    if(activeTab==0){
      if(this.data.min_kj>this.data.qy_kj_num){
        wx.showToast({
          title: '当前套餐会计人数不足团队会计人数',
          icon:'none'
        })
        return false;
      }else if(this.data.min_yg>this.data.qy_yg_num){
       wx.showToast({
         title: '当前套餐员工人数不足团队员工人数',
         icon:'none'
       })
       return false;
      }else{
        var is_open_pc='', is_open_ocr=''
          if(this.data.is_open_pc == 2){
            is_open_pc = this.data.is_open_pc;
          }else{
            this.data.sm?is_open_pc=2:is_open_pc=1
          }
          if(this.data.is_open_ocr == 2){
            is_open_ocr = this.data.is_open_ocr;
          }else{
            this.data.ocr?is_open_ocr=2:is_open_ocr=1
          }
        data={
          uid:wx.getStorageSync('uid'),
          order_type:3,
          finance_number:this.data.kj_num,
          staff_number:this.data.yg_num,               
          is_open_pc:is_open_pc,
          is_open_ocr:is_open_ocr,
          check_number:this.data.yz_num,
          total_fee:this.data.pay[activeTab],
          purchase_duration:this.data.time,
       }
      }
  }else if(activeTab==1){
    data={
      uid:wx.getStorageSync('uid'),
      order_type:this.data.qy_item.type,
      finance_number:this.data.qy_item.qy_kj_num,
      staff_number:this.data.qy_item.qy_yg_num,
      is_open_pc:2,
      is_open_ocr:2,
      check_number:this.data.qy_item.cycs,
      total_fee:this.data.pay[activeTab],
      purchase_duration:1,
     }
  }else if(activeTab==2){
    if(this.data.pay[activeTab]==0){
      wx.showToast({
        title: '请选择扫码器版本',
        icon:'none'
      })
      return false;
    }else if(!this.data.formData.receiving_address||!this.data.formData.receiving_people||!this.data.formData.receiving_tel){
      wx.showToast({
        title: '请完善收件人信息',
        icon:'none'
      })
      return false;
    }
    data={
      uid:wx.getStorageSync('uid'),
      order_type:7,
      total_fee:this.data.pay[activeTab],
      receiving_address:this.data.formData.receiving_address,
      receiving_people:this.data.formData.receiving_people,
      receiving_tel:this.data.formData.receiving_tel,
      product_one_number:this.data.smq[0].checked?this.data.smq[0].num:0,
      product_two_number:this.data.smq[1].checked?this.data.smq[1].num:0
     }
  }
  http.order({
    data:data,
    success:res=>{          
      if(res.data){
        wx.navigateTo({
          url: '/pages/pay/pay?money='+this.data.pay[activeTab]+'&data='+encodeURIComponent(JSON.stringify(res.data)),
        })
      }
    }
  })
   
  },
  saoma_pic(e){//扫码器详情
    var type=e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/saoma_pic/saoma_pic?type='+type,
    })
  },
  onTabCLick(e) {//操作方式
    const index = e.detail.index
    this.setData({activeTab: index}); 
  },
  onChange_tab(e){//操作方式
    const index = e.detail.index
    this.setData({activeTab: index}); 
  },
  getqiye(){
    this.setData({
      activeTab:1
    })
  },
  kaifapiao(){ //开发票
    wx.navigateTo({
      url: '/pages/kaifapiao/kaifapiao',
    })
  },

  setTableHeight() {
    wx.createSelectorQuery().in(this).select('#tabsSwiper').boundingClientRect(rect => {
      this.setData({
        tabHeiaght: rect.height
      })
    }).exec();
  },
  kefu_f(){
    app.kefu_f()
  }
})