function request({pageNum, size, onSuccess}) {
  // 模拟网络请求成功
  setTimeout(function(){
    let data = {}
    data.total = 300
    data.curretPage = pageNum
    let questionList = []
    for (let i = 0; i < size; i++) {
      let item = {}
      item.img = "../../../img/kebi.jpeg"
      questionList.push(item)
    }
    data.questionList = questionList
    onSuccess(data)
  },10)
}

module.exports = {
  request: request
}