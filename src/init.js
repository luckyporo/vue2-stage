import { compileToFunction } from './compiler/index'
import { initState } from './state'

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options

    // 对数据进行初始化
    initState(vm) // 实际上是对vm.$options.data做数据劫持

    if (vm.$options.el) {
      // 将数据挂载到这个模板上
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    // 把模板转化为对应的渲染函数 -> 虚拟DOM VNode -> diff算法更新虚拟dom -> 产生真实节点更新dom
    if (!options.render) { // 没有render用template
      let template = options.template
      if (!template && el) { // 用户也没有传入template,使用的el的内容作为模板
        template = el.outerHTML
        const render = compileToFunction(template)
        options.render = render
      }
    }
  }
}
