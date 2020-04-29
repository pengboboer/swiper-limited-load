// pages/question_answer_card/question_answer_card.js
var util = require('../../utils/util.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 点击答题卡的某一项
   */
  onClickCardItem: function (e) {
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    // 改变之前的swiper的current
    let beforeChangeCurrent = prevPage.data.swiperCurrent
    let beforeChangeIndex = prevPage.data.swiperList[beforeChangeCurrent].index

    let index = e.currentTarget.dataset.index;
    // 进行取余，算出在swiperList的第几位
    let current = index % prevPage.data.swiperListLength
    prevPage.setData({
      swiperList: util.getInitSwiperList(prevPage.data.list, prevPage.data.swiperListLength, index),
      swiperIndex: current,
      swiperCurrent: current,
    })
    // 改变之后的current和改变之前的current相等，index不同，就手动去调用一下swiperChange
    // 如果还是原来的那一项，不去调用swiperChange
    // 因为之前有在swiperChange中保存答题记录的操作，发现偶现记不上
    // 比如现在是第1题, swiperCurrent=0, 当你选择第4题, swiperCurrent还是=0, 对于swiper来说，并没有change
    if (current == beforeChangeCurrent && index != beforeChangeIndex) {
      let e = {detail: {current: current}}
      prevPage.swiperChange(e)
    }

    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      list: app.globalData.questionList,
    })
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
    // 销毁时恢复上一页的切换动画
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      swiperDuration: "250",
    })
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