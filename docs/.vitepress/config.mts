import { resolve } from 'path';
import { defineConfig } from 'vitepress';
import { themeConfig } from './configs/theme';
import { markdownConfig } from './configs/markdown';

export default defineConfig({

  // head配置
  head: [
    // favicon设置
    ['link', { rel: 'icon', href: 'favicon.ico' }],
    // 控制台信息
    ['script', { src: '/js/console-info.js' }],
    // SEO
    ['meta', { name: 'author', content: 'MagicGopher' }],
    ['meta', { name: 'description', content: '记录学习笔记和开发过程中遇到的问题' }],
    ['meta', { name: 'keywords', content: 'Go, Java, C++, Python, Rust, Vue, React, 算法与数据结构, Docker, 容器技术, Kubernetes, 微服务, 云原生, MySQL, Redis, MongoDB, PostgreSQL, 数据库, Ubuntu, 渗透测试, 人工智能' }],
    // 百度
    ['meta', { name: 'baidu-site-verification', content: 'codeva-KxJ1Ol95rj' }],
    // bing
    ['meta', { name: 'msvalidate.01', content: 'C6716D54A56D5BA9D9D54F71353BFEE6' }],
    // google
    ['meta', { name: 'google-site-verification', content: 'egfIVStn9QImuDTotp7bEa2XKq-5E8AvRgk6TFaI-Y0' }],
  ],

  // 标题
  title: "MagicGopher Blog",

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

    // css 配置
    css: {
      // css预处理器
      preprocessorOptions: {
        scss: {
          // 使用现代 Sass 编译器 API
          api: "modern-compiler"
        }
      }
    },
  },
})
