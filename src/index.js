import percent from "./percent.vue"

export default {
  install(Vue, options) {
    // 注册全局组件
    // https://cn.vuejs.org/v2/guide/components-registration.html
    Vue.component("percent", percent)
  }
}
