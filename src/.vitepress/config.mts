import { resolve } from 'path';
import { defineConfig } from 'vitepress';
import { themeConfig } from './configs/theme';
import { markdownConfig } from './configs/markdown';
import MarkdownPreview from 'vite-plugin-markdown-preview';

export default defineConfig({
  // 网站的基础路径
  base: '/',
  // head配置
  head: [
    // favicon设置
    ['link', { rel: 'icon', href: 'go-logo.svg' }],
    // 控制台信息
    ['script', { src: '/js/console-info.js' }],
    // SEO
    ['meta', { name: 'author', content: 'MagicGopher' }],
    ['meta', { name: 'keywords', content: '编程语言,数据库,微服务,云原生,容器编排,渗透测试' }],
  ],
  // 标题
  title: "MagicGopher Blog",
  // 描述
  description: "开源笔记、记录日常开发问题",
  // build输出目录
  outDir: './dist',
  // 获取每个文件最后一次 git 提交的 UNIX 时间戳(ms)，同时它将以合适的日期格式显示在每一页的底部
  lastUpdated: true,
  // 主题
  themeConfig: themeConfig,
  // markdown配置
  markdown: markdownConfig,
  // vite配置
  vite: {
    // 解析配置
    resolve: {
      // 别名配置
      alias: {
        // 将 "@" 映射到项目根目录
        "@": resolve(__dirname, "./"),
      }
    },
    // ssr配置
    ssr: {
      // 指定不进行外部化处理的包
      noExternal: ['@escook/vitepress-theme', 'vitepress']
    },
    // 插件 
    plugins: [
      // 组件预览插件
      MarkdownPreview(),
    ]
  }
})
