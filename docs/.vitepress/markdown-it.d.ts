// 扩展 markdown-it 模块的类型定义
declare module 'markdown-it' {
    // 定义 MarkdownIt 的配置选项接口
    interface MarkdownItOptions {
        // 是否允许 HTML 标签在 Markdown 中直接渲染
        // 类型：boolean，可选
        // 示例：true 表示允许内联 HTML，false 表示禁用
        html?: boolean;

        // 是否自动将文本中的 URL 转换为可点击的链接
        // 类型：boolean，可选
        // 示例：true 表示启用自动链接，false 表示禁用
        linkify?: boolean;

        // 是否启用排版优化（如替换引号、破折号等）
        // 类型：boolean，可选
        // 示例：true 表示启用排版优化，false 表示禁用
        typographer?: boolean;

        // 注释：可根据需要添加更多配置选项
    }

    // 定义 MarkdownIt 的 Token 对象接口，表示解析后的 Markdown 标记
    interface Token {
        // 标记的类型（如 'fence'、'paragraph_open' 等）
        // 类型：string
        type: string;

        // 标记对应的 HTML 标签名
        // 类型：string
        // 示例：'p' 表示段落，'div' 表示容器
        tag: string;

        // 标记的属性列表，格式为 [属性名, 属性值] 的数组
        // 类型：Array<[string, string]>
        // 示例：[['class', 'my-class'], ['id', 'my-id']]
        attrs: Array<[string, string]>;

        // 标记在源文档中的行号范围，可选
        // 类型：[number, number]
        // 示例：[1, 2] 表示从第 1 行到第 2 行
        map?: [number, number];

        // 标记的嵌套级别（0 表示开始，1 表示嵌套内容，-1 表示结束）
        // 类型：number
        nesting: number;

        // 标记的内容（如代码块的源代码或文本内容）
        // 类型：string
        content: string;

        // 标记的符号（如代码块的 ``` 标记）
        // 类型：string
        // 示例：'```' 表示代码块的开始或结束标记
        markup: string;

        // 标记的附加信息（如代码块的语言标识）
        // 类型：string
        // 示例：'mermaid' 表示代码块是 Mermaid 图表
        info: string;

        // 标记的层级，表示在解析树中的深度
        // 类型：number
        level: number;

        // 子标记数组，表示嵌套的标记，可选
        // 类型：Token[]
        children?: Token[];

        // 是否隐藏标记（不渲染），可选
        // 类型：boolean
        hidden?: boolean;
    }

    // 定义 MarkdownIt 的渲染器接口
    interface Renderer {
        // 渲染规则对象，定义如何将标记渲染为 HTML
        rules: {
            // 代码块（fence）渲染函数，可选
            // 参数：
            // - tokens: Token[] - 标记数组
            // - idx: number - 当前标记的索引
            // - options: any - 渲染选项
            // - env: any - 渲染环境
            // - self: any - 渲染器实例
            // 返回值：string - 渲染后的 HTML 字符串
            fence?: (tokens: Token[], idx: number, options: any, env: any, self: any) => string;

            // 其他渲染规则，键为规则名，值为渲染函数
            // 类型：[key: string]: any
            [key: string]: any;
        };
    }

    // 定义 MarkdownIt 类
    class MarkdownIt {
        // 构造函数，接受可选的配置选项
        // 参数 options: MarkdownItOptions - MarkdownIt 的配置
        constructor(options?: MarkdownItOptions);

        // 渲染器实例，包含渲染规则
        // 类型：Renderer
        renderer: Renderer;

        // 解析 Markdown 字符串为标记数组
        // 参数：
        // - str: string - 输入的 Markdown 字符串
        // - env: any - 解析环境，可选
        // 返回值：Token[] - 解析后的标记数组
        parse(str: string, env?: any): Token[];
    }

    // 默认导出 MarkdownIt 类
    export = MarkdownIt;
}