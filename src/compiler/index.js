import { generate } from './generate'
import { parserHTML } from './parser'

// html字符串解析成dom树
export function compileToFunction (template) {
  const root = parserHTML(template)
  console.log(root)

  // 生成代码
  const code = generate(root)
  console.log(code)

  // html -> ast:描述语法 语法不存在的属性无法描述  -> render函数 -> 虚拟dom:增加额外属性 -> 生成真实dom
}
