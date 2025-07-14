import mediumZoom from 'medium-zoom';
import DefaultTheme from "vitepress/theme";
import { h, onMounted, watch, nextTick } from 'vue';
import { inBrowser, useRoute, useData, Router } from 'vitepress';
import { live2dModels } from '../utils/constants';
import BackToTop from '@/components/BackToTop.vue';
import VisitorStats from '@/components/VisitorStats.vue';
import GiscusComment from '@/components/GiscusComment.vue';
import Mermaid from '@/components/Mermaid.vue';
import MNavLinks from '@/components/MNavLinks.vue';
import busuanzi from 'busuanzi.pure.js';
import './style/index.scss';

// 彩虹背景动画样式
let homePageStyle: HTMLStyleElement | undefined

export default {
    // 继承默认主题
    extends: DefaultTheme,
    Layout: () => {
        const props: Record<string, any> = {}

        // 获取 frontmatter
        const { frontmatter } = useData();

        // 添加自定义class
        if (frontmatter.value?.layoutClass) {
            props.class = frontmatter.value.layoutClass
        }

        // 返回布局
        return h(DefaultTheme.Layout, props, {
            // 添加评论
            'doc-after': () => h(GiscusComment),
        });
    },
    async enhanceApp({ app, router }: { app: any, router: Router }) {
        // 注册全局组件
        app.component('BackToTop', BackToTop);
        app.component('VisitorStats', VisitorStats);
        app.component('Mermaid', Mermaid);
        app.component('MNavLinks', MNavLinks);

        // 彩虹背景动画样式
        if (typeof window !== 'undefined') {
            watch(
                () => router.route.data.relativePath,
                () => updateHomePageStyle(location.pathname === '/'),
                { immediate: true },
            )
        }

        // 判断是否在浏览器环境
        if (inBrowser) {
            router.onAfterRouteChanged = () => {
                busuanzi.fetch();
            };
        }

        // Live2D看板娘
        if (!import.meta.env.SSR) {
            const { loadOml2d } = await import('oh-my-live2d');
            loadOml2d({
                models: live2dModels,
                initialStatus: "sleep",
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
}

// 检测浏览器是否为 Safari, Edge 或 Firefox
function isUnsupportedBrowser(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    return (
        ua.includes('safari') && !ua.includes('chrome') || // Safari (排除 Chrome，因为 Chrome 的 UA 也可能包含 Safari)
        ua.includes('firefox') || // Firefox
        ua.includes('edge') || ua.includes('edg/') // Edge (旧版和新版 Chromium-based Edge)
    );
}

// 彩虹背景动画样式
function updateHomePageStyle(value: boolean) {

    // 如果是 Safari、Edge 或 Firefox，直接返回，不应用样式
    if (isUnsupportedBrowser()) {
        if (homePageStyle) {
            homePageStyle.remove();
            homePageStyle = undefined;
        }
        return;
    }

    // 如果 value 为 true，且 homePageStyle 不存在，则创建样式
    if (value) {
        if (homePageStyle) return

        homePageStyle = document.createElement('style')
        homePageStyle.innerHTML = `
            :root {
                animation: rainbow 10s linear infinite;
            }`
        // 将样式添加到文档
        document.body.appendChild(homePageStyle)
    } else {
        if (!homePageStyle) return
        // 如果 value 为 false，且 homePageStyle 存在，则删除样式
        homePageStyle.remove()
        homePageStyle = undefined
    }
}