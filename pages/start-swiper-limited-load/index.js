// pages/start/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    current: 0,
    currentIndex: 0,
    swiperDuration: "0"
  },

  requestQuestionInfo: function () {
    let that = this
    // 模拟网络请求成功
    let questionList = []
    for (let i = 0; i < 300; i++) {
      let item = {}
      item.index = i
      item.total = 300
      item.img = "../../../img/kebi.jpeg"
      questionList.push(item)
    }

    // 初始化重要的是这三步:
    that.setData({
      list: questionList
    })
    that.selectComponent('#swiper').init(0);
    // 假设初始是第二题
    // that.setData({
    //   current: 1
    // })
    // 初始化后再把动画弄出来，否则初始的current不是0，界面会自动跳动到当前位置，体验不太好
    that.setData({
      swiperDuration: '250'
    })

   
     // 全局记一下list, 答题卡页暂时就直接用了
     app.globalData.questionList = questionList
  },

  swiperChange (e) {
    let that = this
    console.log(e.detail)
    let current = e.detail.current
    that.setData({
      currentIndex: current
    })
    if (current == -1) {
      wx.showToast({
        title: "已经是第一题了",
        icon: "none"
      })
      return
    }

    if (current == -2) {
      wx.showModal({
        title: "提示",
        content: "您已经答完所有题，是否退出？",
      })
      return
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