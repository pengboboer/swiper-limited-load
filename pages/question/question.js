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

    list:[]
  },

  swiperChange: function(e) {
    this.hanldeSwiperData(e)
  },

  hanldeSwiperData: function (e) {
    console.log(e)
    var that = this;
    let lastIndex = that.data.swiperIndex
    let current = e.detail.current

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
      wx.showModal({
        title: "提示",
        content: "您已经答完所有题，是否退出？",
      })
      return
    }
    // 触摸情况下
    if (e.detail.source == "touch") {
      console.log("当前swiper下标是：" + current + "，末尾下标为：" + (that.data.swiperList.length - 1) + "。"
        + "当前list下标是" + that.data.swiperList[current].index + "，末尾下标为：" + (that.data.list.length - 1))

      // 正向滑动，到下一个的时候
      // 是正向衔接
      let isLoopPositive = current == 0 && lastIndex == that.data.swiperList.length - 1
      if (current - lastIndex == 1 || isLoopPositive) {
        that.changeNextItem(current)
      }

      // 反向滑动，到上一个的时候
      // 是反向衔接
      var isLoopNegative = current == that.data.swiperList.length - 1 && lastIndex == 0
      if (lastIndex - current == 1 || isLoopNegative) {
        that.changeLastItem(current)
      }
    // 是通过设置current的情况下
    } else {
      that.changeNextItem(current)
      that.changeLastItem(current)
      // 这里说一下，如果有那种在当前的答题页就点击按钮跳到切换上一题下一题的情况
      // 也就是说不是通过触摸滑动来切换上下页的，而是通过setData: current
      // 这里同时设置了两个页面的数据，上一页和下一页，调用了两次setData
      // 在你滑动到某一页时，它的上一页还在执行动画，而这时setData上一页的数据会有一些影响
      // 相比较上面的触摸滑动判断方向只调用一次setData，是有性能上的差异的
      // 页面数据量不大是基本感觉不出来的
      // 但当页面数据量大，又有图片，并且在低端机测试上能明显感觉出一些差别：稍有卡顿

      // 那么还可以继续优化，setCurrent上下页的，其实和触摸滑动一样，判断方向就行
      // 那么就不需要在swiperChange里判断是通过触摸还是setCurrent的方式了
      // 但是一定就需要额外考虑类似答题卡可以直接跳到某一页的操作
      // 你需要在执行跳页操作后手动调用changeNextItem和changeLastItem方法
      // 并且不能再执行swiperChange中的判断正向和反向滑动修改数据的方法了
      // 可以来一个标志位，跳页操作后swiperChange方法直接retrun
    }
    // 记录滑过来的位置，此值对于下一次滑动的计算很重要
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
    let lastDoQuestionIndex = 0

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

  onClickAnswerCard: function(e) {
    let that = this;
    // 跳转前将动画去除，以免点击某选项回来后切换的体验很奇怪
    that.setData({
      swiperDuration: "0"
    })
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