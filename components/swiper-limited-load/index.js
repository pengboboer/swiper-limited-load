// components/swiper-limited-load/index.js
const START = 0
const END = 2
const SWIPER_LENGTH = 3
const NO_PREV_PAGE = -1
const NO_NEXT_PAGE = -2

Component({
  observers: {
    'current': function(index) {
      let that = this
      let current = index % SWIPER_LENGTH
      let {swiperIndex, swiperList} = that.data
      if (swiperList.length == 0 || swiperList[current] == null) {
        return
      }
      // 如果change后还是之前的那一个item，直接return
      if (current == swiperIndex && swiperList[swiperIndex].index == index) {
        return 
      }
      that.init(index)
      // 如果change之后还是当前的current，比如之前是1、点击后是4  之前是2、点击后是5之类
      // 那么不会走swiperChange的change方法，需要我们手动去给它加一个current，然后传出去
      if (current == swiperIndex) {
        that.triggerEvent("change", {source: "",current: index})
      }
    },

  },
  /**
   * 组件的属性列表
   */
  properties: {
    swiperHeight: {
      type: Number,
      value: 0
    },
    list: {
      type: Array,
      value: []
    },
    current: {
      type: Number,
      value: 0
    },
    // 值为0禁止切换动画
    swiperDuration: {
      type: String,
      value: "250"
    },
    // 分页需要传此数据
    total: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 滑动到的位置
    swiperIndex: 0,
    // 此值控制swiper的位置
    swiperCurrent: 0,
    // 当前swiper渲染的items
    swiperList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    init (defaulaIndex) {
      let that = this
      let list = that.data.list
      if (list == null || list.length == 0) {
        return
      }
      // 默认显示的index
      let current = defaulaIndex % SWIPER_LENGTH
      that.setData({
        swiperList: that.getInitSwiperList(list, defaulaIndex),
        swiperIndex: current,
        swiperCurrent: current,
      })
    },

    clear () {
      this.setData({
        list: [],
        swiperList: []
      })
    },

    swiperChange: function (e) {
      let that = this
      let current = e.detail.current
      let lastIndex = that.data.swiperIndex
      let currentItem = that.data.swiperList[current]
      let info = {}
      info.source = e.detail.source
     
      // 正向滑动，到下一个的时候
      // 是正向衔接
      let isLoopPositive = current == START && lastIndex == END
      if (current - lastIndex == 1 || isLoopPositive) {
        // 如果是滑到了左边界或者下一个还未有值，弹回去
        if (currentItem == null) {
          info.current = NO_NEXT_PAGE
          that.triggerEvent("change", info)
          that.setData({
            swiperCurrent: lastIndex
          })
          return
        }
        let swiperChangeItem = "swiperList[" + that.getNextSwiperChangeIndex(current) + "]"
        that.setData({
          [swiperChangeItem]: that.getNextSwiperNeedItem(currentItem, that.data.list)
        })
      }

      // 反向滑动，到上一个的时候
      // 是反向衔接
      var isLoopNegative = current == END && lastIndex == START
      if (lastIndex - current == 1 || isLoopNegative) {
        // 如果滑到了右边界或者上一个还未有值，弹回去
        if (currentItem == null) {
          info.current = NO_PREV_PAGE
          that.triggerEvent("change", info)
          that.setData({
            swiperCurrent: lastIndex
          })
          return
        }
        let swiperChangeItem = "swiperList[" + that.getLastSwiperChangeIndex(current) + "]"
        that.setData({
          [swiperChangeItem]: that.getLastSwiperNeedItem(currentItem, that.data.list)
        })
      }

      if (currentItem == null) return 
      info.current = currentItem.index
      that.triggerEvent("change", info)
      // 记录滑过来的位置，此值对于下一次滑动的计算很重要
      that.data.swiperIndex = current
    },

        /**
     * 获取初始化的swiperList
     */
    getInitSwiperList : function (list, defaultIndex) {
      let that = this
      let current = defaultIndex % SWIPER_LENGTH
      let realIndex = list.findIndex(function(item){
        return item.index == defaultIndex
      })
      let currentItem = list[realIndex]
      let swiperList = []
      swiperList[current] = currentItem
      swiperList[that.getLastSwiperChangeIndex(current)] = that.getLastSwiperNeedItem(currentItem, list)
      swiperList[that.getNextSwiperChangeIndex(current)] = that.getNextSwiperNeedItem(currentItem, list)
      console.log("初始化swiperList",swiperList)
      return swiperList;
    },
    /**
     * 获取swiperList中current上一个的index
     */
    getLastSwiperChangeIndex : function (current) {
      return current > START ? current - 1 : END
    },
    /**
     * 获取swiperLit中current下一个的index
     */
    getNextSwiperChangeIndex : function (current) {
      return current < END ? current + 1 : START
    },
    /**
     * 获取上一个要替换的list中的item
     */
    getLastSwiperNeedItem : function (currentItem, list) {
      if (currentItem == null) return null;
      let listNeedIndex = currentItem.index - 1
      let realIndex = list.findIndex(function(item){
        return item.index == listNeedIndex
      })
      if (realIndex == -1) return null
      let item = listNeedIndex == -1 ? null : list[realIndex]
      return item
    },
    /**
     * 获取下一个要替换的list中的item
     */
    getNextSwiperNeedItem : function (currentItem, list) {
      if (currentItem == null) return null;
      let listNeedIndex = currentItem.index + 1
      let realIndex = list.findIndex(function(item){
        return item.index == listNeedIndex
      })
      if (realIndex == -1) return null
      let total = this.data.total != 0 ? this.data.total : list.length
      let item = listNeedIndex == total ? null : list[realIndex]
      return item
    }
    
  }
})
