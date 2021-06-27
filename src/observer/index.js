import { isObject } from '../utils'
import { arrMethods } from './array'

// 如果数据是对象 会对对象递归进行劫持
// 如果是数组 会劫持数组方法并对数组中不是基本数据类型的数据进行劫持

class Observer {
  constructor (data) {
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })
    // 劫持数组
    if (Array.isArray(data)) {
      // 对数组原来会造成数组本身发生改变的方法进行改写 切片编程 高阶函数
      Object.setPrototypeOf(data, arrMethods)
      // 如果数组中的数据是对象类型, 需要监控对象的变化
      this.observeArray(data)
    } else { // 劫持对象
      this.walk(data)
    }
  }

  observeArray (data) {
    data.forEach(item => observe(item))
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
      // console.log('get', data, key)
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
  if (!isObject(data)) return
  if (data.__ob__) return
  return new Observer(data)
}
