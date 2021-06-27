import { initMixin } from './init'

function Vue (options) {
  this._init(options) // 初始化
}
// 拓展原型
initMixin(Vue)

export default Vue
