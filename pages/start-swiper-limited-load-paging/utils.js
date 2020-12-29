// 分页为如下格式：
// {
// 	"total": 300,
// 	"currentPage": 1,
// 	"list": []
// }



// 模拟网络请求一页数据
function request({currentPage, size, onSuccess, onFailed}) {
  setTimeout(function(){
    let data = {}
    data.total = 300
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
  },100)
}

// 同时请求多页数据
function requestMulti({pageList, size, onSuccess, onFailed}) {
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
    let list = []
    results.forEach(function(resultItem){
      list = list.concat(resultItem.questionList)
    })
    console.log(list)
    onSuccess(list)
  }).catch(function(err){
    console.log(err)
    onFailed(err)
  })
}

// 根据初始index和每页item的数量获取当前是第几页
var getInitcurrentPage = function(index, size) {
  let pageNum = parseInt((index + 1) / size)
  let remain = (index + 1) % size
  return remain == 0 ? pageNum : pageNum + 1
}


// 获取初始请求网络的pageList
var getInitPageList = function(currentIndex, size, currentPage, total) {
  let pageList = []
  // 需要请求此页和上一页的数据
  if ((currentIndex + 1) % size == 1 && currentIndex != 0) {
    pageList = [currentPage - 1, currentPage]
  }
  // 需要请求此页和下一页的数据
  if ((currentIndex + 1) % size == 0 && currentIndex != (total - 1)) {
    pageList = [currentPage, currentPage + 1]
  }
  // 请求一页即可
  pageList = [currentPage]
  return pageList
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
  request: request,
  requestMulti: requestMulti,
  getInitcurrentPage: getInitcurrentPage,
  getInitPageList: getInitPageList,
  initAnswerCardList: initAnswerCardList
}