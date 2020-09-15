# swiper-limited-load
## 一个答题小程序Demo, 包含做题页和答题卡页
这里实现了如下功能和细节：<br>
* 保证swiper-item的数量固定，加载大量数据时，大大优化渲染效率<br>
* 记录上次的位置，页面初次加载不一定非得是第一页，可以是任何页<br>
* 答题卡选择某一index回来以后的数据替换，并去掉swiper切换动画，提升交互体验<br><br>

<img src="/img/1.jpeg" width = "400" height = "888"/>   <img src="/img/2.jpeg" width = "400" height = "888" /><br><br>
### 当加载300个item时，微信自带的swiper需要渲染将近4秒，而swiper-limited-load只需加载3个item，所以渲染很快<br><br>
<img src="/img/3.jpeg" width = "400" height = "888"/>   <img src="/img/4.jpeg" width = "400" height = "888" />

[csdn原文：微信小程序答题页实现——swiper渲染优化](https://blog.csdn.net/pengbo6665631/article/details/103955422)<br><br>
### 如果对你有帮助，动动小手给个star,谢谢。
