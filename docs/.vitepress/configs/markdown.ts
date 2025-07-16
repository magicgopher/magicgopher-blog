import type { MarkdownOptions } from 'vitepress';
import { specificPaths, blacklistPaths } from '../utils/constants';

// 将路径字符串转换为正则表达式
const toRegex = (path: string) => new RegExp(path.replace(/\//g, '\\/'));
// 将路径数组转换为正则表达式数组
const specificPathsRegex = specificPaths.map(toRegex);
// 将路径数组转换为正则表达式数组
const blacklistPathsRegex = blacklistPaths.map(toRegex);

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

    // 自定义Markdown渲染
    config: (md) => {
        // 配置函数，接受参数md（Markdown实例）
        const render = md.render.bind(md);

        // 绑定md.render方法到变量render上
        md.render = (...args) => {
            // 重写md.render方法，接受任意数量的参数args
            const [src, env] = args;

            // 获取当前渲染的文件路径
            const filePath = env.path;

            // 检查文件路径，决定是否插入 <BackToTop /> 组件
            if (filePath && specificPathsRegex.some(path => path.test(filePath)) && !blacklistPathsRegex.some(path => path.test(filePath))) {
                // 检查文件路径是否包含在 specificPathsRegex 中，且不在 blacklistPathsRegex 中
                const result = render(src, env);
                // 将 <BackToTop /> 组件插入到渲染结果之前
                return `<BackToTop />\n${result}`;
            }

            // 否则，返回原始的渲染结果
            return render(src, env);
        };
    },
    
    // 你可以使用 langAlias 选项注册自定义的语言别名
    languageAlias: {
        // 注册 .gitignore 为 html
        '.gitignore': 'html',
        // 注册 .md 为 html
        'txt': 'html',
    }
}