import mermaid from 'mermaid';
import type MarkdownIt from 'markdown-it';

/**
 * 获取当前主题模式
 * 
 * @returns 'light' | 'dark' - 返回当前主题模式，'light' 表示浅色主题，'dark' 表示深色主题
 */
function getCurrentTheme(): 'light' | 'dark' {
    // 检查运行环境是否为浏览器（确保 window 对象存在）
    if (typeof window !== 'undefined') {
        // 检查 document.documentElement 是否包含 'dark' 类，判断是否为深色模式
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? 'dark' : 'light';
    }
    // 非浏览器环境（如 Node.js）默认返回浅色主题
    return 'light';
}

/**
 * 异步渲染 Mermaid 图表
 * 
 * @param id - 图表的唯一标识符，用于生成 SVG 的 ID
 * @param code - Mermaid 图表的源代码（如流程图、时序图的定义）
 * @returns Promise<string> - 异步返回渲染后的 SVG 字符串
 */
export async function render(id: string, code: string) {
    // 获取当前主题模式
    const theme = getCurrentTheme();
    
    // 根据主题模式选择合适的 Mermaid 主题
    // 'default' 用于浅色模式，'dark' 用于深色模式
    const mermaidTheme: 'default' | 'dark' = theme === 'dark' ? 'dark' : 'default';
    
    // 初始化 Mermaid 配置
    mermaid.initialize({ 
        // 禁止页面加载时自动渲染图表
        startOnLoad: false,
        // 设置 Mermaid 图表主题
        theme: mermaidTheme
    });

    // 生成一个带时间戳的唯一 ID，确保每次渲染都是全新的 ID
    // 这样 Mermaid 永远不会在这个 ID 上遇到冲突
    const uniqueId = `${id}-${Date.now()}`;
    
    // 使用 uniqueId 进行渲染
    const { svg } = await mermaid.render(uniqueId, code);
    
    // 返回渲染后的 SVG 字符串
    return svg;
}

/**
 * Mermaid 插件，用于扩展 MarkdownIt 的渲染功能
 * 
 * @param md - MarkdownIt 实例，用于注册自定义渲染规则
 * @returns void
 */
export default function mermaidPlugin(md: MarkdownIt): void {
    // 保存 MarkdownIt 默认的 fence 渲染规则（处理代码块）
    const fence = md.renderer.rules.fence!.bind(md.renderer.rules);

    // 重写 fence 渲染规则以支持 Mermaid 代码块
    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        // 获取当前代码块的 token
        const token = tokens[idx];
        // 获取代码块的语言信息（如 'mermaid'）
        const language = token.info.trim();

        // 检查代码块是否为 Mermaid 类型
        if (language.startsWith('mermaid')) {
            // 将 Mermaid 代码块转换为自定义的 <Mermaid> HTML 标签
            // id 属性为 'mermaid-索引'，code 属性为 URL 编码后的代码内容
            return `<Mermaid id="mermaid-${idx}" code="${encodeURIComponent(token.content)}"></Mermaid>`;
        }

        // 非 Mermaid 代码块，使用默认的 fence 渲染规则处理
        return fence(tokens, idx, options, env, self);
    };
}