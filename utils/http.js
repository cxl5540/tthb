// http.js
const app = getApp();
module.exports = {
  http(url, method, params,action) {
     // 获取token，自行获取token和签名，token和签名表示每个接口都要发送的数据
    let token = ''
     // 获取签名 (后台怎么定义的，就传什么) 具体情况穿不穿
    let sign = ''
    let data = {
      action:action
    }

    if(action=='Home/get_red_packet'|| action=='Home/get_gold'|| action=='Personal/personal_info'|| action=='Home/home_info'|| action=='Home/get_verify'){
      wx.hideLoading();   
    }else{
      wx.showLoading({
        title: '加载中...',
        mask:true
      });
    } 
    // 在这里判断一下data是否存在，params表示前端需要传递的数据，params是一个对象，有三组键值对，
    // data：表示请求要发送的数据，success：成功的回调，fail：失败的回调，这三个字段可缺可无，其余字段会忽略
    if (params.data) { 
      for (let key in params.data) { // 在这里判断传过来的参数值为null，就删除这个属性
        if (params.data[key] == null || params.data[key] == 'null') {
          delete params.data[key]
        }
      }
      data = {
        ...data,
        ...params.data
      }
    }
     // 就是拼接上前缀,此接口域名是开放接口，可访问 如果开发环境可以勾选详情选项的 不校验合法域名、TLS版本及HTTPS证书
    wx.request({
      url:url,
      // 判断请求类型，除了值等于'post'外，其余值均视作get其他的请求类型也可以自己加上的
      method: method, 
      data,
      // post请求 把header 该为 application/x-www-form-urlencoded 就可以了
     header: {
             'content-type': method == 'get' ? 'application/json' : 'application/x-www-form-urlencoded'
          },
      success(res) {  
          params.success && params.success(res.data)       
      },
      fail(err) {
        wx.showToast({
          title: '服务器内部错误',
          icon: 'none',
          duration: 1500
        })
        params.fail && params.fail(err)
      },
      complete() {
        setTimeout(() => {
           wx.hideLoading();
        },1000)
      }
    })
  }
}