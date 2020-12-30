// pages/start/index.js
var Utils = require('../start-swiper-limited-load-paging/utils.js')
const NO_PREV_PAGE = -1
const NO_NEXT_PAGE = -2

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    // 缓存某一页数据的map
    cachePageDataMap: null,
    // 改变此值可控制swiper的位置
    current: 0,
    // 仅仅记录swiper的位置
    currentIndex: 0,
    swiperDuration: "250",

    currentPage: 1,
    pageSize: 10,
    total: 0,
    requesting: false
  },

  swiperChange (e) {
    let that = this
    console.log(e.detail)
    let current = e.detail.current
    that.setData({
      currentIndex: current
    })

    if (current == NO_PREV_PAGE || current == NO_NEXT_PAGE) {
      if (that.data.requesting) {
        wx.showToast({
          title: "数据加载中",
          icon: "none"
        })
        return
      } 

      if (current == NO_PREV_PAGE) {
        wx.showToast({
          title: "已经是第一题了",
          icon: "none"
        })
        return
      }

      if (current == NO_NEXT_PAGE) {
        wx.showModal({
          title: "提示",
          content: "您已经答完所有题，是否退出？",
        })
        return
      }
    }

    this.loadMore(current)
  },

  loadMore(current) {
    let list = this.data.list
    if (this.data.requesting) return
    // 是加载上一页
    if (current == list[0].index && current != 0) {
      this.judgeLoadWay(list[0].currentPage - 1)
    }
    // 是加载下一页
    if (current == list[list.length - 1].index && current != this.data.total - 1) {
      this.judgeLoadWay(list[list.length - 1].currentPage + 1)
    }
  },

  judgeLoadWay(currentPage) {
    let cachePageDataMap = this.data.cachePageDataMap
    if (cachePageDataMap.has(currentPage)) {
      this.loadCacheOnePageInfo(currentPage)
      return 
    } 

    this.requestOnePageInfo(currentPage)
  },

  requestOnePageInfo (currentPage) {
    let that = this
    that.data.requesting = true
    Utils.request({
      currentPage: currentPage, 
      size: that.data.pageSize, 
      onSuccess: function(info){
        that.data.requesting = false
        that.handleOnePageInfo(info.questionList)
      },
      onFailed: function(msg) {
        that.data.requesting = false
      }
    })
  },

  loadCacheOnePageInfo (currentPage) {
    let list = this.data.cachePageDataMap.get(currentPage)
    this.handleOnePageInfo(list)
  },

  handleOnePageInfo (list) {
    let that = this
    let currentList = that.data.list
    if (list == null || list.length == 0) return 
 
    if (currentList == null || currentList.length == 0) {
      that.setData({
        list: list
      })
      that.selectComponent("#swiper").init(that.data.currentIndex)
      return 
    }

    if (list[0].currentPage == currentList[0].currentPage) return

    // 看是需要将新的list往前插还是往后插
    let finalList = list[0].currentPage < currentList[0].currentPage ? 
                  list.concat(currentList) : currentList.concat(list)
    that.setData({
      list: finalList
    })
    that.selectComponent("#swiper").init(that.data.currentIndex)
  },




  onClickAnswerCard: function (e) {
    let that = this
    // 因为某一项不一定是在当前项的左侧还是右侧
    // 跳转前将动画去除，以免点击某选项回来后切换的体验很奇怪
    that.setData({
      swiperDuration: "0"
    })
    wx.navigateTo({
      url: '../../pages/answer_card/index'
    })
    console.log(that.data.cachePageDataMap)
  },

  onClickLast: function (e) {
    let that = this
    if (that.data.currentIndex - 1 < 0) {
      return 
    }
    that.setData({
      current: that.data.currentIndex - 1
    })
  },

  onClickNext: function (e) {
    let that = this
    if (that.data.currentIndex + 1 > that.data.total - 1) {
      return 
    }
    that.setData({
      current: that.data.currentIndex + 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 列表总长度，一定要在第一次请求列表数据前明确该值
    let total = Utils.TOTAL
    // 初始化答题卡列表
    Utils.initAnswerCardList(total)
    that.setData({
      swiperHeight: wx.getSystemInfoSync().windowHeight,
      total: total,
      cachePageDataMap: new Map()
    })

    // 默认值为defautIndex，比如上次答到了第几题
    let index = parseInt(options.defaultIndex)
    that.refresh(index)
  },

  refresh(currentIndex) {
    let that = this
    // 根据index和size计算得出数据在第几页
    let currentPage = Utils.getInitcurrentPage(currentIndex, that.data.pageSize)
    that.setData({
      currentIndex: currentIndex,
      currentPage: currentPage,
    })
    
    let {pageSize, total} = that.data
    // 不确定我们需要请求几个列表，可能是1个，也可能是2个
    // 比如一页10条，我们上次答题答到了第10题，正好在这个临界点上，我们还需要第11道题的数据
    // 那么我们需要一起请求第一页和第二页的数据
    let pageList = Utils.getInitPageList(currentIndex, pageSize, currentPage, total)
    that.judgeInitWay(pageList)
  },

  judgeInitWay(pageList) {
    let cachePageDataMap = this.data.cachePageDataMap
    let isNeedRequestNet = false;
    pageList.forEach(function(item){
      if (!cachePageDataMap.has(item)) {
        isNeedRequestNet = true
      }
    })

    if (!isNeedRequestNet) {
      this.loadCacheInitPageInfo(pageList)
      return 
    } 

    this.requestInitPageInfo(pageList)
  },

  requestInitPageInfo (pageList) {
    let that = this
    that.data.requesting = true
    Utils.requestMulti({
      pageList: pageList,
      size: that.data.pageSize,
      onSuccess: function(results){
        that.data.requesting = false
        that.handleInitInfo(results)
      },
      onFailed: function(msg){
        that.data.requesting = false
      }
    })
  },

  loadCacheInitPageInfo (pageList) {
    let that = this
    let results = []
    pageList.forEach(function(item){
      let info = {}
      info.currentPage = item
      info.questionList = that.data.cachePageDataMap.get(item)
      results.push(info)
    })
    
    that.handleInitInfo(results)
  },

  handleInitInfo (results) {
    let that = this
    let list = []
    results.forEach(function(resultItem, index){
      that.data.cachePageDataMap.set(resultItem.currentPage, resultItem.questionList)
      list = list.concat(resultItem.questionList)
    })
    that.setData({
      list: list
    })
    that.selectComponent("#swiper").init(that.data.currentIndex)
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})