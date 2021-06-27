export const arrMethods = Object.create(Array.prototype) // arrMethods.__proto__ = Array.prototype

const methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'reverse',
  'sort',
  'splice'
]

methods.forEach(method => {
  // 如果用户调用的是以上7个方法使用重写的,否则使用原来数组方法
  arrMethods[method] = function (...args) {
    // console.log('数组发生了变化')
    Array.prototype[method].call(this, ...args)

    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default:
        break
    }

    // 如果有新增内容需要进行继续劫持
    if (inserted) ob.observeArray(inserted)
  }
})
