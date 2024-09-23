import mediumZoom from 'medium-zoom';
import { h, onMounted, watch, nextTick } from 'vue';
import { inBrowser, Theme, useRoute } from 'vitepress';
import { live2dModels } from '../utils/constants'
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
        });
    },
    async enhanceApp({ app, router }) {
        app.component('BackTop', BackTop);
        app.component('VisitorStats', VisitorStats);
        // 判断是否在浏览器环境
        if (inBrowser) {
            router.onAfterRouteChanged = () => {
                busuanzi.fetch();
            };
        }
        if (!import.meta.env.SSR) {
            const { loadOml2d } = await import('oh-my-live2d');
            loadOml2d({
                models: live2dModels
            });
        }
    },
    setup() {
        // 使用 useRoute() 获取当前路由信息
        const route = useRoute();
        // 初始化图片缩放功能
        const initZoom = () => {
            mediumZoom('.main img', { background: 'var(--vp-c-bg)' });
        };
        // 当组件挂载后执行初始化图片缩放
        onMounted(() => {
            initZoom();
        });
        // 监听路由路径变化，并在下一个 tick 执行初始化图片缩放
        watch(
            () => route.path,
            () => nextTick(() => initZoom())
        );
    }
} satisfies Theme;

// 检查代码是否在浏览器环境中运行(而不是在服务器端环境如 Node.js 中运行)
if (typeof window !== 'undefined') {
    // 通过检查用户代理字符串来检测用户的浏览器类型
    const browser = navigator.userAgent.toLowerCase();
    // 如果用户代理字符串包含 'chrome'，为 HTML 根元素添加 'browser-chrome' 类
    if (browser.includes('chrome')) {
        document.documentElement.classList.add('browser-chrome');
    }
    // 如果用户代理字符串包含 'firefox'，为 HTML 根元素添加 'browser-firefox' 类
    else if (browser.includes('firefox')) {
        document.documentElement.classList.add('browser-firefox');
    }
    // 如果用户代理字符串包含 'safari'，为 HTML 根元素添加 'browser-safari' 类
    else if (browser.includes('safari')) {
        document.documentElement.classList.add('browser-safari');
    }
}