import type MarkdownIt from 'markdown-it';
import mermaid from 'mermaid';

// 定义一个异步函数用于渲染Mermaid图表
export async function render(id: string, code: string) {
    // 初始化mermaid配置，设置startOnLoad为false，表示不会自动渲染
    mermaid.initialize({ startOnLoad: false })
    
    // 使用mermaid.render方法渲染图表，并返回SVG内容
    const { svg } = await mermaid.render(id, code)
    
    // 返回渲染后的SVG
    return svg
}

// 定义Mermaid插件，用于扩展MarkdownIt的渲染功能
export default function mermaidPlugin(md: MarkdownIt): void {
    // 获取MarkdownIt默认的fence渲染规则（即代码块渲染规则）
    const fence = md.renderer.rules.fence?.bind(md.renderer.rules)

    // 重写fence渲染规则
    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]  // 获取当前token（代码块）
        const language = token.info.trim()  // 获取代码块的语言信息

        // 如果代码块的语言是mermaid
        if (language.startsWith('mermaid')) {
            // 将Mermaid代码块转换为自定义的HTML标签<Mermaid>
            return `<Mermaid id="mermaid-${idx}" code="${encodeURIComponent(token.content)}"></Mermaid>`
        }

        // 否则，使用默认的fence渲染规则处理代码块
        return fence(tokens, idx, options, env, self)
    }
}
