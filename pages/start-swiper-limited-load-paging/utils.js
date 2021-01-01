// 分页为如下格式：
// {
// 	"total": 300,
// 	"currentPage": 1,
// 	"list": []
// }

var TOTAL = 100
var NET_DELAY_TIME = 1000


// 模拟网络请求一页数据
function request({currentPage, size, onSuccess, onFailed}) {
  setTimeout(function(){
    let data = {}
    data.total = TOTAL
    data.currentPage = currentPage
    let questionList = []
    for (let i = 0; i < size; i++) {
      let item = {}
      item.currentPage = currentPage
      item.index = i + (currentPage - 1) * size
      item.total = data.total
      item.img = "../../../img/kebi.jpeg"
      questionList.push(item)
    }
    data.questionList = questionList
    onSuccess(data)
  }, NET_DELAY_TIME)
}

// 同时请求多页数据
function requestMulti({pageList, size, onSuccess, onFailed}) {
  console.log("请求哪几页数据？",pageList)
  wx.showLoading({
    title: '加载中',
  })
  let promise = Promise.all(pageList.map(function(pageNum) {
      return new Promise(function(resolve, reject){
        request({
          currentPage: pageNum, 
          size: size, 
          onSuccess: function(res){
            resolve(res)
          }, 
          onFailed: function(msg){
            reject(new Error('failed to request'))
          }
        })
      })
  }))
  promise.then(function(results){
    wx.hideLoading()
    onSuccess(results)
  }).catch(function(err){
    wx.hideLoading()
    onFailed(err)
  })
}

// 根据初始index和每页item的数量获取当前是第几页
var getInitcurrentPage = function(index, size) {
  let pageNum = parseInt((index + 1) / size)
  let remain = (index + 1) % size
  return remain == 0 ? pageNum : pageNum + 1
}


// 获取初始的pageList, 可能一页，可能两页
var getInitPageList = function(currentIndex, size, currentPage, total) {
  if ((currentIndex + 1) % size == 1 && currentIndex != 0) {
    return [currentPage - 1, currentPage]
  }
  if ((currentIndex + 1) % size == 0 && currentIndex != (total - 1)) {
    return [currentPage, currentPage + 1]
  }
  return [currentPage]
}

function initAnswerCardList (total) {
   if (!getApp().globalData.questionList) {
    let list = []
    for (let i = 0; i < total; i++) {
     list.push({})
    }
    getApp().globalData.questionList = list
  }
}

module.exports = {
  TOTAL:TOTAL,
  request: request,
  requestMulti: requestMulti,
  getInitcurrentPage: getInitcurrentPage,
  getInitPageList: getInitPageList,
  initAnswerCardList: initAnswerCardList
}