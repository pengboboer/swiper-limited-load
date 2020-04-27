/**
 * 获取初始化的swiperList
 */
var getInitSwiperList = function (list, swiperListLength, lastDoQuestionIndex) {
  let swiperList = []
  for (let i = 0; i < swiperListLength; i++) {
    swiperList.push({})
  }

  // current
  let current = lastDoQuestionIndex % swiperListLength
  swiperList[current] = list[lastDoQuestionIndex]

  // current的上一个
  let lastSwiperIndex = getLastSwiperChangeIndex(current, swiperList)
  swiperList[lastSwiperIndex] = getLastSwiperItem(current, swiperList, list)

  // current的下一个
  let nextSwiperIndex = getNextSwiperChangeIndex(current, swiperList)
  swiperList[nextSwiperIndex] = getNextSwiperItem(current, swiperList, list)
  console.log(swiperList)
  return swiperList;
}


/**
 * 页面改变
 */
var changePage = function (that, current) {
  let lastIndex = that.data.swiperIndex
  // 如果是滑到了左边界，再弹回去
  if (that.data.swiperList[current].isFirstPlaceholder) {
    that.setData({
      swiperCurrent: lastIndex
    })
    wx.showToast({
      title: "已经是第一题了",
      icon: "none"
    })
    return
  }
  // 如果滑到了右边界，弹回去，再弹个对话框
  if (that.data.swiperList[current].isLastPlaceholder) {
    that.setData({
      swiperCurrent: lastIndex
    })
    wx.showModal({
      title: "提示",
      content: "您已经答完所有题，是否退出？",
    })
    return
  }

  // 正向滑动，到下一个的时候
  // 是正向衔接
  let isLoopPositive = current == 0 && lastIndex == that.data.swiperList.length - 1
  if (current - lastIndex == 1 || isLoopPositive) {
    changeNextItem(that, current)
  }

  // 反向滑动，到上一个的时候
  // 是反向衔接
  var isLoopNegative = current == that.data.swiperList.length - 1 && lastIndex == 0
  if (lastIndex - current == 1 || isLoopNegative) {
    changeLastItem(that, current)
  }

  // 记录滑过来的位置，此值对于下一次滑动的计算很重要
  that.data.swiperIndex = current
}



/**
 * 获取swiperList中current上一个的index
 * 正常 - 1
 * 或
 * 循环衔接到末尾
 */
var getLastSwiperChangeIndex = function (current, swiperList) {
  return current > 0 ? current - 1 : swiperList.length - 1
}



/**
 * 获取上一个要替换的list中的item
 */
var getLastSwiperItem = function (current, swiperList, list) {
  // swiperList所需要替换的index
  let swiperChangeIndex = getLastSwiperChangeIndex(current, swiperList)
  // list中我们需要的那个item的index
  let listNeedIndex = swiperList[current].index - 1
  // 如果要替换的下标超出了0，添加一个占位item
  let item = listNeedIndex == -1 ? { isFirstPlaceholder: true } : list[listNeedIndex]
  return item
}


/**
 * 获取swiperLit中current下一个的index
 * 正常 + 1
 * 或
 * 循环衔接到首位
 */
var getNextSwiperChangeIndex = function (current, swiperList) {
  return current < swiperList.length - 1 ? current + 1 : 0
}


/**
 * 获取下一个要替换的list中的item
 */
var getNextSwiperItem = function (current, swiperList, list) {
  // swiperList所需要替换的index
  let swiperChangeIndex = getNextSwiperChangeIndex(current, swiperList)
  // list中我们需要的那个item的index
  let listNeedIndex = swiperList[current].index + 1
  // 如果要替换的下标超出了list的下标，添加一个占位item
  let item = listNeedIndex == list.length ? { isLastPlaceholder: true } : list[listNeedIndex]
  return item
}


/**
 * 改变下一项
 */
var changeNextItem = function (that, current) {
  let swiperChangeIndex = getNextSwiperChangeIndex(current, that.data.swiperList)
  let swiperChangeItem = "swiperList[" + swiperChangeIndex + "]"
  that.setData({
    [swiperChangeItem]: getNextSwiperItem(current, that.data.swiperList, that.data.list)
  })
}

/**
 * 改变上一项
 */
var changeLastItem = function (that, current) {
  let swiperChangeIndex = getLastSwiperChangeIndex(current, that.data.swiperList)
  let swiperChangeItem = "swiperList[" + swiperChangeIndex + "]"
  that.setData({
    [swiperChangeItem]: getLastSwiperItem(current, that.data.swiperList, that.data.list)
  })
}

module.exports = {
  getInitSwiperList: getInitSwiperList,
  changePage: changePage
}
