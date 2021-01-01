# swiper-limited-load
## 一个答题小程序Demo, 包含做题页和答题卡页，并且新增了分页的demo
### 图片可能加载不出来，可看这两篇文章，有图片及对应的思路
[csdn原文：微信小程序答题页实现——swiper渲染优化](https://blog.csdn.net/pengbo6665631/article/details/103955422)<br>
[微信小程序交流专区：微信小程序答题页实现——swiper渲染优化](https://developers.weixin.qq.com/community/develop/article/doc/000ecafb3486f07000c92c3225c013)<br>
### 示例动图
<img src="https://img-blog.csdnimg.cn/20200918102227499.gif" width = "250" height = "555"/>
这里实现了如下功能和细节：<br>
* 保证swiper-item的数量固定，加载大量数据时，大大优化渲染效率<br>
* 记录上次的位置，页面初次加载不一定非得是第一页，可以是任何页<br>
* 答题卡选择某一index回来以后的数据替换，并去掉swiper切换动画，提升交互体验<br><br>

<img src="https://img-blog.csdnimg.cn/20200916142812474.jpeg" width = "250" height = "555"/>   <img src="https://img-blog.csdnimg.cn/20200916142842196.jpeg" width = "250" height = "555" /><br><br>
#### 当加载300个item时，微信自带的swiper需要渲染将近4秒。而swiper-limited-load只加载3个item，渲染很快<br><br>
<img src="https://img-blog.csdnimg.cn/20201228150032890.jpeg" width = "250" height = "555"/>   <img src="https://img-blog.csdnimg.cn/2020122815013697.jpeg" width = "250" height = "555" />

# 使用方法<br>
* 将components中的swiper-limited-load复制到您的项目中<br>
* 在需要的页面引用此组件，并且创建自己的自定义组件item-view<br>
* 在初始化数据时，为你的list的每一项指定index属性<br>
* 具体可以参照项目目录start-swiper-limited-load中的用法<br>
* 分页的demo可以参照项目目录start-swiper-limited-load-paging中的用法<br>
* 说明：其它属性和swiper无异，你们可以自己单独添加你们需要的属性<br>

### 如果对你有帮助，动动小手给个star,谢谢。
