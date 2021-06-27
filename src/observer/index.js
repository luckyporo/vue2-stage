import { isObject } from '../utils'

class Observer {
  constructor (data) {
    this.walk(data)
  }

  walk (data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

// vue2会对对象进行遍历 将每个属性用用defineProperty重新定义 性能差
function defineReactive (data, key, value) {
  observe(value) // value如果是对象需要继续观测劫持 递归 性能差
  Object.defineProperty(data, key, {
    get () {
      return value
    },
    set (newVal) {
      observe(newVal) // 如果新的值设置的是对象也需要对这个对象进行观测劫持
      value = newVal
    }
  })
}

export function observe (data) {
  // 如果是对象才观测
  if (!isObject(data)) {
    return
  }
  return new Observer(data)
}
