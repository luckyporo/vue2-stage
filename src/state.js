import { isFunction } from './utils'
import { observe } from './observer/index'

export function initState (vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function proxy (vm, source, key) {
  Object.defineProperty(vm, key, {
    get () {
      return vm[source][key]
    },
    set (newVal) {
      vm[source][key] = newVal
    }
  })
}

function initData (vm) {
  let data = vm.$options.data
  // 劫持data中的所有数据 Object.definedProperty
  // 此时vm和data没有任何关系 需要使用_data将二者关联起来
  data = vm._data = isFunction(data) ? data.call(vm) : data
  // 做一个proxy 将data.key映射到_data.key
  for (const key in data) {
    proxy(vm, '_data', key)
  }

  observe(data)
}
