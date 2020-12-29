// pages/start/index.js
var Utils = require('../start-swiper-limited-load-paging/utils.js')
const app = getApp()
const NO_PREV_PAGE = -1
const NO_NEXT_PAGE = -2

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    current: 0,
    currentIndex: 0,
    swiperDuration: "250",

    currentPage: 1,
    pageSize: 10,
    total: 300,
    requesting: false
  },



  requestListInfo () {
    let that = this
    that.data.requesting = true
    Utils.request({
      currentPage: that.data.currentPage, 
      size: that.data.pageSize, 
      onSuccess: function(info){
        that.data.requesting = false
        that.handleData(info)
      },
      onFailed: function(msg) {
        that.data.requesting = false
      }
    })
  },

  handleData (info) {
    let that = this
    console.log(info)
   
    that.setData({
      list: that.data.list.concat(info.questionList)
    })

    that.selectComponent("#swiper").init(that.data.currentIndex)
    Utils.initAnswerCardList(info.total)
  },

  swiperChange (e) {
    let that = this
    console.log(e.detail)
    let current = e.detail.current
    that.setData({
      currentIndex: current
    })

    if (current == NO_PREV_PAGE || current == NO_NEXT_PAGE) {
      console.log(that.data.requesting)
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

    let list = that.data.list
    if (current == list[0].index && !that.data.requesting) {
      that.data.currentPage = list[0].index - 1
      that.requestListInfo()
    }

    if (current == list[list.length - 1].index && !that.data.requesting) {
      that.data.currentPage = list[list.length - 1].currentPage + 1
      that.requestListInfo()
    }
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
    if (that.data.currentIndex + 1 > that.data.list.length - 1) {
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
    // 默认值为defautIndex，比如上次答到了第几题
    let index = parseInt(options.defaultIndex)
    let currentPage = Utils.getInitcurrentPage(index, that.data.pageSize)

    that.setData({
      swiperHeight: wx.getSystemInfoSync().windowHeight,
      currentIndex: parseInt(options.defaultIndex),
      currentPage: currentPage
    })

    that.initRequestInfo()
  },

  initRequestInfo() {
    let that = this
    let {currentIndex, pageSize, currentPage, total} = that.data
    Utils.requestMulti({
      pageList: Utils.getInitPageList(currentIndex, pageSize, currentPage, total),
      size: pageSize,
      onSuccess: function(list){
        that.handleRequestInfo(list)
      },
      onFailed: function(msg){

      }
    })
  },

  handleRequestInfo(list) {
    let that = this
    let currentList = that.data.list
    if (currentList == null || currentList.length == 0) {
      this.setData({
        list: list
      })
      that.selectComponent("#swiper").init(that.data.currentIndex)
      return 
    }
    // 需要往前插入
    if (list[0].currentPage < currentList[0].currentPage) {
      this.setData({
        list: currentList.splice(0, 1, list)
      })
    // 往后添加
    } else {
      this.setData({
        list: currentList.concat(list)
      })
    }

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