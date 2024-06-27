import { DefaultTheme } from 'vitepress';
import { zhNavbar } from '../navbar/index';
import { zhSidebar } from '../sidebar/index';
import { GitHubConfigConstants } from '../utils/constants';
import { localSearchOptions } from '../configs/search/local-search'

export const themeConfig: DefaultTheme.Config = {
    // logo
    logo: {
        light: '/images/gif/blob-sunglasses.gif',
        dark: '/images/gif/blob-sun.gif'
    },
    // 中文导航
    nav: zhNavbar,
    // 中文侧边栏
    sidebar: zhSidebar,
    // 右侧大纲配置
    outline: {
        level: 'deep',
        label: '本页目录',
    },
    // 开启本地搜索（左上角）
    search: {
        provider: 'local',
        options: localSearchOptions
    },
    // 最后更新时间
    lastUpdatedText: '上次更新',
    // 定义返回顶部按钮的文本（该标签仅在移动端视图中显示）
    returnToTopLabel: "👆返回顶部",
    // 侧边栏菜单标题（移动端显示）
    sidebarMenuLabel: "👈 专题",
    // 浅色模式切换按钮标题
    lightModeSwitchTitle: "切换到浅色主题",
    // 文章底部导航栏的自定义配置，默认是英语
    docFooter: {
        prev: '上一篇',
        next: '下一篇',
    },
    // 社交链接
    socialLinks: [
        { icon: 'github', link: `https://github.com/${GitHubConfigConstants.UserName}` }
    ],
    // 页脚
    footer: {
        message: '基于 MIT 许可发布',
        copyright: `版权所有 © 2020-${new Date().getFullYear()} <a href="https://github.com/${GitHubConfigConstants.UserName}">${GitHubConfigConstants.UserName}</a>`
    },
    // 编辑链接
    editLink: {
        text: '在 GitHub 上编辑此页',
        pattern: `https://github.com/${GitHubConfigConstants.UserName}/${GitHubConfigConstants.ProjectName}/edit/main/docs/:path`,
    },
}