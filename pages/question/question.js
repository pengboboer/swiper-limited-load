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
    // 需要几个swiperItem
    swiperListLength: 3,


    list:[
      { index: 0, totalCount: 20 },
      { index: 1, totalCount: 20 },
      { index: 2, totalCount: 20 },
      { index: 3, totalCount: 20 },
      { index: 4, totalCount: 20 },
      { index: 5, totalCount: 20 },
      { index: 6, totalCount: 20 },
      { index: 7, totalCount: 20 },
      { index: 8, totalCount: 20 },
      { index: 9, totalCount: 20 },
      { index: 10, totalCount: 20 },
      { index: 11, totalCount: 20 },
      { index: 12, totalCount: 20 },
      { index: 13, totalCount: 20 },
      { index: 14, totalCount: 20 },
      { index: 15, totalCount: 20 },
      { index: 16, totalCount: 20 },
      { index: 17, totalCount: 20 },
      { index: 18, totalCount: 20 },
      { index: 19, totalCount: 20 }]

  },

  swiperChange: function(e) {
    this.hanldeSwiperData(e)
  },

  hanldeSwiperData: function (e) {
    var that = this;
    console.log(e)
    let lastIndex = that.data.swiperIndex
    let current = e.detail.current
    // 触摸情况下
    if (e.detail.source == "touch") {
      // 如果是滑到了左边界，再弹回去
      if (that.data.swiperList[current].isFirstPlaceholder) {
        that.setData({
          swiperCurrent: lastIndex
        })
        return
      }
      // 如果滑到了右边界，弹回去，再弹个对话框
      if (that.data.swiperList[current].isLastPlaceholder) {
        that.setData({
          swiperCurrent: lastIndex,
          // todo 弹个对话框
        })
        return
      }

      console.log("当前swiper下标是：" + current + "，末尾下标为：" + (that.data.swiperList.length - 1) + "。"
        + "当前list下标是" + that.data.swiperList[current].index + "，末尾下标为：" + (that.data.list.length - 1))

      // 正向滑动
      // 是正向衔接
      let isLoopPositive = current == 0 && lastIndex == that.data.swiperList.length - 1
      if (current - lastIndex == 1 || isLoopPositive) {
        that.changeNextItem(current)
      }

      // 反向滑动
      // 是反向衔接
      var isLoopNegative = current == that.data.swiperList.length - 1 && lastIndex == 0
      if (lastIndex - current == 1 || isLoopNegative) {
        that.changeLastItem(current)
      }
    // 是通过设置current的情况下
    } else {
      that.changeNextItem(current)
      that.changeLastItem(current)
    }

    that.data.swiperIndex = current
  },

  changeNextItem: function (current) {
    let that = this
    let swiperChangeIndex = util.getNextSwiperChangeIndex(current, that.data.swiperList)
    let swiperChangeItem = "swiperList[" + swiperChangeIndex + "]"
    that.setData({
      [swiperChangeItem]: util.getNextSwiperItem(current, that.data.swiperList, that.data.list)
    })
  },

  changeLastItem: function (current) {
    let that = this
    let swiperChangeIndex = util.getLastSwiperChangeIndex(current, that.data.swiperList)
    let swiperChangeItem = "swiperList[" + swiperChangeIndex + "]"
    that.setData({
      [swiperChangeItem]: util.getLastSwiperItem(current, that.data.swiperList, that.data.list)
    })
  },


  requestQuestionInfo: function() {
    let that = this
    // 模拟网络请求成功
    let questionList = [
      { index: 0, totalCount: 20 },
      { index: 1, totalCount: 20 },
      { index: 2, totalCount: 20 },
      { index: 3, totalCount: 20 },
      { index: 4, totalCount: 20 },
      { index: 5, totalCount: 20 },
      { index: 6, totalCount: 20 },
      { index: 7, totalCount: 20 },
      { index: 8, totalCount: 20 },
      { index: 9, totalCount: 20 },
      { index: 10, totalCount: 20 },
      { index: 11, totalCount: 20 },
      { index: 12, totalCount: 20 },
      { index: 13, totalCount: 20 },
      { index: 14, totalCount: 20 },
      { index: 15, totalCount: 20 },
      { index: 16, totalCount: 20 },
      { index: 17, totalCount: 20 },
      { index: 18, totalCount: 20 },
      { index: 19, totalCount: 20 }]
    // 上次做题的进度，上次做到第五题了
    let lastDoQuestionIndex = 5

    let current = lastDoQuestionIndex % that.data.swiperListLength
    that.setData({
      list: questionList,
      swiperList: util.getInitSwiperList(questionList, that.data.swiperListLength, lastDoQuestionIndex),
      swiperIndex: current,
      swiperCurrent: current,
    })

    app.globalData.questionList = questionList
  },

  onClickAnswerCard: function(e) {
    let that = this;
    // 需要swiperListLength计算点击后的current
    // swiperCurrent也是需要的，如果current和swiperCurrent相同，页面返回后就不会触发swiperChange的方法了
    wx.navigateTo({
      url: '../../pages/question_answer_card/question_answer_card?swiperListLength='
        + that.data.swiperListLength + "&swiperCurrent=" + that.data.swiperCurrent,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      swiperHeight: wx.getSystemInfoSync().windowHeight
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