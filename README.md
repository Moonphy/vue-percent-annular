# vue-percent-annular
> vue下面的一个单值百分百圆环图

## vue项目中如何使用
```js
# install 
npm i vue-percent-annular
 
# 在vue项目的main.js中引入及注册
import percent from 'vue-percent-annular'
 
Vue.use(percent)
 
# 在页面中使用
<template>
  <div class="percentWrap">
    <percent
      :theme="theme"
      :percent="percent"
      :text-name="textName"
    />
  </div>
</template>
 
export default {
  data () {
    return {
      percent: 60,
      textName: '市场占有率',
      theme: 'blueLight'
    }
  }
}

.percentWrap{
    height: 500px;
    background-color: #42b983;
}
```

## options
> 可以通过props改变几种配置

1、theme
* 百分比的颜色（主题），目前定制了三种颜色，分别是'orange','blueLight', 'blueDark'，后期有时间会加入自定义颜色，直接传色值

2、percent
* 百分百值

3、text-name
* 显示的二级说明文字

## 另外
> 控制圆环图的大小是通过设置percent这个组件的父级dom元素就行，如：
```css
.percentWrap{
    height: 500px;
    background-color: #42b983;
}
```