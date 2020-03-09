`ps: 搭配思维导图食用更佳!`
![](https://user-gold-cdn.xitu.io/2020/3/9/170be1a57d671dbe?w=6981&h=2185&f=png&s=1430207)
### 在onload中,必须在获取云数据库的数据时给innerAudioContext.src赋默认值
```JavaScript
Page({
  onLoad: function (options) {
        album.get().then(res => {//获取云数据库的数据
          this.setData({
            albums: res.data
          })
          innerAudioContext.src = res.data[this.data.currentIndex].link
        })
        //错误innerAudioContext.src = this.data.albums[this.data.currentIndex].link 
        //此处console.log(this.data.albums)为[]因为album.get()是异步操作
    }
})
```
### 解决监听音频进度更新onTimeUpdate不执行
> 更新onTimeUpdate不触发和onWaiting有关,当拖动进度\播放完毕\切歌等重新加载音乐时，都会**触发onWaiting，然后onTimeUpdate就无法执行**.解决方法是:暂停音乐后再定时(延迟时间要充足!)播放

```JavaScript
innerAudioContext.pause()//暂停音乐
      //音乐跳转到指定位置
      innerAudioContext.seek((e.detail.value * innerAudioContext.duration) / 100)
      setTimeout(() => {
        innerAudioContext.play()//播放音乐
      }, 500)
```

### 实现图片原地旋转动画
[https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/wx.createAnimation.html]()
```JavaScript
const innerAudioContext = wx.createInnerAudioContext()
const animation = wx.createAnimation({//创造动画
  duration: 500,
  timingFunction: 'linear',
})
this.data.timer = setInterval(() => {//封面旋转
        animation.rotate(this.data.rotate_deg).step()
        this.setData({
          rotate_deg: this.data.rotate_deg + 45,
          animationData: animation.export()
        })
      }, 500)
```
### 获取当前歌曲信息
[https://blog.csdn.net/qq_41183241/article/details/100570042](参考文章)
|方法|用法|
|--|--|
|wx:for|在组件上使用 wx:for 控制属性绑定一个数组，即可使用数组中各项的数据重复渲染该组件|
|wx:key|指定列表中项目的唯一的标识符|
|wx:key="字符串"|代表在 for 循环的 array 中 item 的某个 property，该 property 的值需要是列表中唯一的字符串或数字，且不能动态改变。|
|wx:key="*this"|代表在 for 循环中的 item 本身，这种表示需要 item 本身是一个唯一的字符串或者数字。|
|wx:for-item|指定数组当前元素的变量名|
|wx:for-index|可以指定数组当前下标的变量名|
|data-*|组件上触发的事件时，会发送给事件处理函数|
```Html
<block wx:for="{{albums}}" wx:key="index" >
    <image src="{{item.cover}}" class="item_cover" bindtap="imgClick" data-index="{{index}}" wx:for-index="index"></image>
  </block> 
```
```javascript
imgClick:function (e){
    this.setData({
      currentIndex: e.target.dataset.index
    })
    ...
  },
```
### 如何如何实现切割保证进度条正常更新-暂停播放(用原生的还是自制的)
[https://developers.weixin.qq.com/community/develop/doc/00068a72a2c588d3c6c8edeac56800]()
### 如何获取网易云音乐链接
网易云音乐外链(其中id改为相应的歌曲ID即可):[http://music.163.com/song/media/outer/url?id=562598065.mp3](其中id改为相应的歌曲ID即可)
### 实现歌曲循环播放
- 第一首切上一首:　①当前索引 = 歌单长度; 当前索引-1
- 最后一首切下一首: ①当前索引 = (当前索引 + 1) % 歌单长度
```JavaScript
prev_song: function(){//上一首
    if (this.data.currentIndex == 0) {//判断是否是第一首歌
      this.data.currentIndex = this.data.albums.length
    }
    this.setData({
      currentIndex: this.data.currentIndex - 1
    })
    ...
  },
  next_song: function () {//下一首
    var len = this.data.albums.length//歌曲列表长度
    var x = (this.data.currentIndex + 1) % len//下一首歌的索引
    this.setData({
      currentIndex: x
    })
    ...
  },
```
