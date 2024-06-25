import { DefaultTheme } from 'vitepress';
import { GitHubConfigConstants } from '../utils/constants';

export const themeConfig: DefaultTheme.Config = {
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