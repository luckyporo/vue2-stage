
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function gen (el) {
  if (el.type === 1) return generate(el)
  else {
    const text = el.text
    if (!defaultTagRE.test(text)) return `_v('${text}')`
    else {
      // hello{{name}}world -> 'hello' + name + 'world'
      const tokens = []
      let match
      let index
      let lastIndex = defaultTagRE.lastIndex = 0 // 正则bug 上面test过一次后必须强制清零lastIndex否则再执行exec拿到的永远是空数组
      // eslint-disable-next-line no-cond-assign
      while (match = defaultTagRE.exec(text)) { // 是否匹配的上正则
        console.log(match)
        index = match.index // {起始索引位置
        if (index > lastIndex) { // 如果起始位置索引大于上一次匹配最后位置的索引证明此时是纯字符串
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`) // 将匹配到的变量trim后包装_s放入数组
        lastIndex = index + match[0].length
        console.log(lastIndex)
      }
      // 如果循环完毕正则匹配后 最后的索引位置小于整个字符串长度 证明}之后的都是纯字符串 需要放入数组
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      // console.log(tokens)
      return `_v(${tokens.join('+')})`
    }
  }
}

function genProps (attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (attr.name === 'style') {
      const styleObj = {}
      attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
        styleObj[arguments[1].trim()] = arguments[2].trim()
      })
      attr.value = styleObj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function genChildren (el) {
  const children = el.children
  if (children) {
    return children.map(child => gen(child)).join(',')
  }
}

export function generate (el) {
  // 遍历数 将数拼接成字符串
  // _c('div', {id: "app", class: "a"})
  const children = genChildren(el)
  const code = `_c('${el.tag}',${el.attrs.length ? genProps(el.attrs) : 'undefined'}${children ? `,${children}` : ''})`

  return code
}
