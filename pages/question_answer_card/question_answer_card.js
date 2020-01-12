// pages/question_answer_card/question_answer_card.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 点击答题卡的某一项
   */
  onClickCardItem: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    // 进行取余，算出在swiperList的第几位
    let current = index % that.data.swiperListLength
    let currentSwiperListItem = "swiperList[" + current + "]";

    prevPage.setData({
      swiperCurrent: current,
      [currentSwiperListItem]: prevPage.data.list[index],
    })
    // 如果上次的current和这次选择后算出来的current相同
    // 相同位置手动调用添加相邻位置item的方法
    if (that.data.swiperCurrent == current) {
      prevPage.changeNextItem(current)
      prevPage.changeLastItem(current)
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
      swiperListLength: parseInt(options.swiperListLength),
      swiperCurrent: parseInt(options.swiperCurrent),
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