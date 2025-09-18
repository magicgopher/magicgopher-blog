import mermaidPlugin from './mermaid';
import type { MarkdownOptions } from 'vitepress';

// 将路径字符串转换为正则表达式
const toRegex = (path: string) => new RegExp(path.replace(/\//g, '\\/'));

// markdown配置
export const markdownConfig: MarkdownOptions = {
    // markdown主题配置
    theme: {
        // 白天主题
        light: "github-light",
        // 黑夜主题
        dark: 'dracula'
    },

    // 代码行号是否显示
    lineNumbers: true,

    image: {
        // 图片懒加载
        lazyLoading: true
    },

    config(md) {
        // 使用Mermaid插件
        md.use(mermaidPlugin as any);
    },
    
    // 你可以使用 langAlias 选项注册自定义的语言别名
    languageAlias: {
        // 注册 .gitignore 为 html
        '.gitignore': 'html',
        // 注册 .md 为 html
        'txt': 'html',
    }
}