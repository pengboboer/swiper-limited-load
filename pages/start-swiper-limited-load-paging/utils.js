// 分页为如下格式：
// {
// 	"total": 300,
// 	"currentPage": 1,
// 	"list": []
// }



// 模拟网络请求成功
function request({currentPage, size, onSuccess, onFailed}) {
  setTimeout(function(){
    let data = {}
    data.total = 300
    data.curretPage = currentPage
    let questionList = []
    for (let i = 0; i < size; i++) {
      let item = {}
      item.img = "../../../img/kebi.jpeg"
      questionList.push(item)
    }
    data.questionList = questionList
    onSuccess(data)
  },1000)
}

// 根据初始index和每页item的数量获取当前是第几页
var getInitcurrentPage = function(index, size) {
  let pageNum = parseInt((index + 1) / size)
  let remain = (index + 1) % size
  return remain == 0 ? pageNum : pageNum + 1
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
  getInitcurrentPage: getInitcurrentPage,
  initAnswerCardList: initAnswerCardList
}