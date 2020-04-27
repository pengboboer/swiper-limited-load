// pages/question/question.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 滑动到的位置
    swiperIndex: 0,
    // 此值控制swiper的位置
    swiperCurrent: 0,
    // 值为0禁止切换动画
    swiperDuration: "250",
    // 当前swiper渲染的items
    swiperList: [],
    // 需要几个swiperItem, 最少值为3,如果有分页的需求，可以是10、20, 任何
    swiperListLength: 3,

    list: []
  },


  requestQuestionInfo: function () {
    let that = this
    // 模拟网络请求成功
    let questionList = [
      { index: 0 },
      { index: 1 },
      { index: 2 },
      { index: 3 },
      { index: 4 },
      { index: 5 },
      { index: 6 },
      { index: 7 },
      { index: 8 },
      { index: 9 },
      { index: 10 },
      { index: 11 },
      { index: 12 },
      { index: 13 },
      { index: 14 },
      { index: 15 },
      { index: 16 },
      { index: 17 },
      { index: 18 },
      { index: 19 },
    ]
    // 上次做题的进度，比如上次做到第十题了
    let lastDoQuestionIndex = 9
    let current = lastDoQuestionIndex % that.data.swiperListLength
    that.setData({
      list: questionList,
      swiperList: util.getInitSwiperList(questionList, that.data.swiperListLength, lastDoQuestionIndex),
      swiperIndex: current,
      swiperCurrent: current,
    })
    // 暂时全局记一下list, 答题卡页直接用了
    app.globalData.questionList = questionList
  },

  swiperChange: function (e) {
    let that = this
    let current = e.detail.current
    util.changePage(that, current)
  },

  onClickAnswerCard: function (e) {
    let that = this;
    // 跳转前将动画去除，以免点击某选项回来后切换的体验很奇怪
    that.setData({
      swiperDuration: "0"
    })
    // 需要swiperListLength计算点击后的current
    wx.navigateTo({
      url: '../../pages/question_answer_card/question_answer_card?swiperListLength=' + that.data.swiperListLength,
    })
  },

  onClickLast: function (e) {
    let that = this
    let lastIndex = that.data.swiperIndex == 0 ? that.data.swiperList.length - 1 : that.data.swiperIndex - 1
    that.setData({
      swiperCurrent: lastIndex
    })
  },

  onClickNext: function (e) {
    let that = this
    let nextIndex = that.data.swiperIndex == that.data.swiperList.length - 1 ? 0 : that.data.swiperIndex + 1
    that.setData({
      swiperCurrent: nextIndex
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      swiperHeight: wx.getSystemInfoSync().windowHeight,
    })
    that.requestQuestionInfo()
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
    app.globalData.questionList = null
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