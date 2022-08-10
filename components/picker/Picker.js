Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },

    initValue: { // 初始化日期
      type: String,
      value: ''
    },
    items: {
      type: Array,
      value: []
    }
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: true, //是否显示
    setValues: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hiddeDatePicker: function () {
      this.setData({
        flag: !this.data.flag
      })
    },
    //展示弹框
    showDatePicker() {
      this.setData({
        flag: !this.data.flag
      })
      this._getItems()
    },

    // 点击确定
    _confirm() {
      let item = this.data.items[this.data.setValues[0]]
      this.triggerEvent('confirm', item);
    },

    // 滑动  methods
    _bindChange(e) {
      this.setData({
        setValues:e.detail.value
      })
    },

    // 获取初始化信息
    _getItems(e) {
      if (this.data.items.length && this.data.initValue) {
        let items = this.data.items
        console.log(items)
        for (let i = 0; i < items.length; i++) {
          if (this.data.initValue == items[i].id) {
            this.setData({
              setValues: [i]
            })
            return
          }
        }
      }
      this.setData({
        setValues: [0]
      })
    },

  },
})