/**
 * 获取swiperLit中current上一个的index
 * 正常 - 1
 * 或
 * 循环衔接到末尾
 */
var getLastSwiperChangeIndex = function (current, swiperList) {
  return current - 1 > -1 ? current - 1 : swiperList.length - 1
}

/**
 * 获取上一个要替换的list中的item
 */
var getLastSwiperItem = function (current, swiperList, list) {
  // swiperList所需要替换的index
  let swiperChangeIndex = getLastSwiperChangeIndex(current, swiperList)
  // list中我们需要的那个item的index
  let listNeedIndex = swiperList[current].index - 1
  console.log("上一个")
  console.log("替换的swiper下标为：" + swiperChangeIndex + "，" + "替换的list下标是：" + listNeedIndex)
  // 替换数据
  let swiperChangeItem = "swiperList[" + swiperChangeIndex + "]"
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
  return current + 1 < swiperList.length ? current + 1 : 0
}


/**
 * 获取下一个要替换的list中的item
 */
var getNextSwiperItem = function (current, swiperList, list) {
  // swiperList所需要替换的index
  let swiperChangeIndex = getNextSwiperChangeIndex(current, swiperList)
  // list中我们需要的那个item的index
  let listNeedIndex = swiperList[current].index + 1
  console.log("下一个")
  console.log("替换的swiper下标为：" + swiperChangeIndex + "，" + "替换的list下标是：" + listNeedIndex)

  // 如果要替换的下标超出了list的下标，添加一个占位item
  let item = listNeedIndex == list.length ? { isLastPlaceholder: true } : list[listNeedIndex]

  return item
}

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
  console.log("工具类初始化的swiperList：")
  console.log(swiperList)
  return swiperList;
}

module.exports = {
  getLastSwiperChangeIndex: getLastSwiperChangeIndex,
  getLastSwiperItem: getLastSwiperItem,
  getNextSwiperChangeIndex: getNextSwiperChangeIndex,
  getNextSwiperItem: getNextSwiperItem,
  getInitSwiperList: getInitSwiperList,
}
