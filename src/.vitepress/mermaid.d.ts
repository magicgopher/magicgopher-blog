// 扩展mermaid
declare module 'mermaid' {
    interface MermaidOptions {
        startOnLoad: boolean;
    }

    interface MermaidRenderResult {
        svg: string;
    }

    function initialize(options: MermaidOptions): void;
    function render(id: string, code: string): Promise<MermaidRenderResult>;

    export = {
        initialize,
        render,
    };
}

// 扩展markdown-it
declare module 'markdown-it' {
    interface MarkdownItOptions {
        html?: boolean;
        linkify?: boolean;
        typographer?: boolean;
        // 可根据需要添加更多配置选项
    }

    interface Token {
        type: string;
        tag: string;
        attrs: Array<[string, string]>;
        map?: [number, number];
        nesting: number;
        content: string;
        markup: string;
        info: string;
        level: number;
        children?: Token[];
        hidden?: boolean;
    }

    interface Renderer {
        rules: {
            fence?: (tokens: Token[], idx: number, options: any, env: any, self: any) => string;
            [key: string]: any;
        };
    }

    class MarkdownIt {
        constructor(options?: MarkdownItOptions);
        renderer: Renderer;
        parse(str: string, env?: any): Token[];
    }

    export = MarkdownIt;
}