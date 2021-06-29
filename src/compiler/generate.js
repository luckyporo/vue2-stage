
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
      let lastIndex = defaultTagRE.lastIndex = 0
      // eslint-disable-next-line no-cond-assign
      while (match = defaultTagRE.exec(text)) {
        // console.log(match)
        const index = match.index
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
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
