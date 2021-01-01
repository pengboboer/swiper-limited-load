// pages/answer_card/index.js
const app = getApp()


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
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    console.log(prevPage)
    if (prevPage.route == "pages/start-swiper/index" 
        || prevPage.route == "pages/start-swiper-limited-load/index") {
      prevPage.setData({
        current: e.currentTarget.dataset.index
      })
    }

    if (prevPage.route == "pages/start-swiper-limited-load-paging/index") {
      prevPage.selectComponent("#swiper").clear()
      let index  = e.currentTarget.dataset.index
      prevPage.refresh(index)
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
    setTimeout(function(){
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        swiperDuration: "250",
      })
    }, 500)
   
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