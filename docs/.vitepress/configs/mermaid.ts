import type MarkdownIt from 'markdown-it';
import mermaid from 'mermaid';

/**
 * 异步渲染 Mermaid 图表
 * 将 Mermaid 图表代码渲染为 SVG 格式的字符串
 *
 * @param id 图表的唯一标识符，用于 Mermaid 渲染
 * @param code Mermaid 图表定义代码（如流程图、时序图等）
 * @returns 渲染后的 SVG 字符串
 */
export async function render(id: string, code: string): Promise<string> {
    // 初始化 Mermaid 配置，设置 startOnLoad 为 false，防止自动渲染
    mermaid.initialize({ startOnLoad: false });

    // 使用 mermaid.render 方法渲染图表，获取 SVG 内容
    const { svg } = await mermaid.render(id, code);

    // 返回渲染后的 SVG 字符串
    return svg;
}

/**
 * Mermaid 插件，用于扩展 MarkdownIt 的渲染功能
 * 将 Mermaid 代码块转换为自定义的 <Mermaid> 标签，供前端进一步处理
 *
 * @param md MarkdownIt 实例
 */
export default function mermaidPlugin(md: MarkdownIt): void {
    // 获取 MarkdownIt 默认的 fence 渲染规则（用于处理代码块）
    const fence = md.renderer.rules.fence!.bind(md.renderer.rules);

    // 重写 fence 渲染规则
    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]; // 获取当前代码块 token
        const language = token.info.trim(); // 获取代码块的语言标记

        // 如果代码块语言是 mermaid
        if (language.startsWith('mermaid')) {
            // 将 Mermaid 代码块转换为 <Mermaid> 标签，包含唯一 ID 和编码后的代码
            return `<Mermaid id="mermaid-${idx}" code="${encodeURIComponent(token.content)}"></Mermaid>`;
        }

        // 否则，使用默认的 fence 渲染规则处理其他代码块
        return fence(tokens, idx, options, env, self);
    };
}
