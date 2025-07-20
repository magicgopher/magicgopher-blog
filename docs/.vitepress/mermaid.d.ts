// 扩展 mermaid 模块的类型定义
declare module 'mermaid' {
    // 定义 Mermaid 的配置选项接口
    interface MermaidOptions {
        // 是否在页面加载时自动渲染 Mermaid 图表
        // 类型：boolean
        // 示例：true 表示自动渲染，false 表示手动渲染
        startOnLoad: boolean;

        // Mermaid 图表的主题样式，可选属性
        // 类型：string
        // 支持的值：'default'、'dark'、'forest'、'neutral' 等
        // 示例：'dark' 表示暗色主题，'default' 表示默认主题
        theme?: string;
    }

    // 定义 Mermaid 渲染结果的接口
    interface MermaidRenderResult {
        // 渲染后的 SVG 字符串，表示图表的图形内容
        // 类型：string
        // 示例：'<svg>...</svg>'
        svg: string;
    }

    // 初始化 Mermaid 库的函数
    // 参数 options: MermaidOptions - 配置对象，用于设置 Mermaid 的行为
    // 返回值：void
    function initialize(options: MermaidOptions): void;

    // 渲染 Mermaid 图表的函数
    // 参数 id: string - 图表的唯一标识符，用于生成 SVG 的 ID
    // 参数 code: string - Mermaid 图表的源代码（如流程图、时序图的定义）
    // 返回值：Promise<MermaidRenderResult> - 异步返回渲染结果，包含 SVG 字符串
    function render(id: string, code: string): Promise<MermaidRenderResult>;

    // 默认导出的对象，包含 Mermaid 的核心方法
    export = {
        initialize, // 初始化函数
        render,     // 渲染函数
    };
}