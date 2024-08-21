import { h } from 'vue';
import { inBrowser, Theme } from 'vitepress';
import escookTheme from '@escook/vitepress-theme';
import BackTop from '@/components/BackTop.vue';
import VisitorStats from '@/components/VisitorStats.vue';
import GiscusComment from '@/components/GiscusComment.vue';
import busuanzi from 'busuanzi.pure.js';
import '@escook/vitepress-theme/style.css';
import './style/index.scss';

export default {
    extends: escookTheme,
    Layout: () => {
        return h(escookTheme.Layout, null, {
            // 添加评论
            'doc-after': () => h(GiscusComment),
        })
    },
    enhanceApp({ app, router }) {
        app.component('BackTop', BackTop);
        app.component('VisitorStats', VisitorStats);
        // 判断是否在浏览器环境
        if (inBrowser) {
            router.onAfterRouteChanged = () => {
                busuanzi.fetch()
            }
        }
    }
} satisfies Theme;

// 检查代码是否在浏览器环境中运行(而不是在服务器端环境如 Node.js 中运行)
if (typeof window !== 'undefined') {
    // 通过检查用户代理字符串来检测用户的浏览器类型
    const browser = navigator.userAgent.toLowerCase()
    // 如果用户代理字符串包含 'chrome'，为 HTML 根元素添加 'browser-chrome' 类
    if (browser.includes('chrome'))
        document.documentElement.classList.add('browser-chrome')
    // 如果用户代理字符串包含 'firefox'，为 HTML 根元素添加 'browser-firefox' 类
    else if (browser.includes('firefox'))
        document.documentElement.classList.add('browser-firefox')
    // 如果用户代理字符串包含 'safari'，为 HTML 根元素添加 'browser-safari' 类
    else if (browser.includes('safari'))
        document.documentElement.classList.add('browser-safari')
}