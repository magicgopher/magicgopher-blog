import type { MarkdownOptions } from 'vitepress';

// 要插入 <BackTop /> 组件的路径数组
const specificPaths = [
    // 格式：'docs/zh/program'
    'src/docs/zh/编程语言',
    'src/docs/zh/前端技术',
    'src/docs/zh/DevOps',
    'src/docs/zh/关于我',
];

// 不需要插入 <BackTop /> 组件的文件路径黑名单
const blacklistPaths: string[] = [
    // 格式：'docs/zh/program/go/01-Go语言基础/08-字符串处理.md'
    // 'docs/zh/program/go/01-Go语言基础/08-字符串处理.md'
];

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
    lineNumbers: false,
    // 图片懒加载
    image: {
        lazyLoading: true
    },
    // 自定义渲染markdown组件
    config: (md) => {
        const render = md.render.bind(md);
        md.render = (...args) => {
            const [src, env] = args;
            const filePath = env.path; // 获取当前渲染的文件路径

            // 检查文件路径，决定是否插入 <BackTop /> 组件
            if (filePath && specificPathsRegex.some(path => path.test(filePath)) && !blacklistPathsRegex.some(path => path.test(filePath))) {
                const result = render(src, env);
                return `<BackTop />\n${result}`;
            }

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