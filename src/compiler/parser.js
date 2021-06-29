const ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*' // 标签名
const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')' // 复杂标签名 <a:x></a:x> <x></x> 用来获取标签名
const startTagOpen = new RegExp(('^<' + qnameCapture)) // 匹配开始标签
const startTagClose = /^\s*(\/?)>/ // 匹配自闭合标签 <br />
const endTag = new RegExp(('^<\\/' + qnameCapture + '[^>]*>')) // 匹配闭合标签
// a=b a="b" a='b'
const attribute = /^\s*([^\s"'<>/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{ aaaa }}

function createASTElement (tagName, attrs) {
  return {
    tag: tagName,
    type: 1,
    children: [],
    parent: null,
    attrs
  }
}

let root = null
const stack = []
function start (tagName, attrs) {
  const parent = stack[stack.length - 1]
  const element = createASTElement(tagName, attrs)
  if (!root) root = element
  element.parent = parent
  if (parent) parent.children.push(element)
  stack.push(element)
}

function end (tagName) {
  const last = stack.pop()
  if (last.tag !== tagName) throw Error('标签有误')
}

function chars (text) {
  text = text.replace(/\s/g, '')
  const parent = stack[stack.length - 1]
  if (text) {
    parent.children.push({
      type: 3,
      text
    })
  }
}

export function parserHTML (html) {
  function advance (len) {
    html = html.substring(len)
  }

  function parseStartTag () {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attributes: []
      }
      advance(start[0].length)
      let end
      let attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attributes.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
    return false
  }

  while (html) { // 判断解析的内容是否存在 如果存在就不停的进行解析
    const textEnd = html.indexOf('<') // 当前解析的开头
    if (textEnd === 0) {
      const startTagMatch = parseStartTag(html)

      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attributes)
        continue
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
    }
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      chars(text)
      advance(text.length)
    }
  }
  return root
}
