// 导入 medium-zoom 库，用于图片缩放功能
import mediumZoom from 'medium-zoom';
// 导入 VitePress 默认主题
import DefaultTheme from "vitepress/theme";
// 导入 Vue 的相关 hooks，用于组件生命周期和响应式处理
import { h, onMounted, watch, nextTick } from 'vue';
// 导入 VitePress 的路由和数据 hooks，用于获取路由信息和 frontmatter 数据
import { useRoute, useData, Router } from 'vitepress';
// 导入 Live2D 模型配置常量
import { live2dModels } from '../utils/constants';
// 导入自定义组件：返回顶部按钮、Giscus 评论、Mermaid 图表和导航链接
import BackToTop from '@/components/BackToTop.vue';
import GiscusComment from '@/components/GiscusComment.vue';
import Mermaid from '@/components/Mermaid.vue';
import MNavLinks from '@/components/MNavLinks.vue';
// 导入全局样式文件
import './style/index.scss';

// 定义全局变量，用于存储动态添加的彩虹背景动画样式
let homePageStyle: HTMLStyleElement | undefined;

// 导出默认主题配置，扩展 VitePress 默认主题
export default {
    // 继承 VitePress 默认主题
    extends: DefaultTheme,

    // 定义自定义布局组件
    Layout: () => {
        // 初始化 props 对象，用于传递给布局组件
        const props: Record<string, any> = {};

        // 获取页面的 frontmatter 数据
        const { frontmatter } = useData();

        // 如果 frontmatter 中定义了 layoutClass，则将其添加到 props 中作为自定义类
        if (frontmatter.value?.layoutClass) {
            props.class = frontmatter.value.layoutClass;
        }

        // 返回渲染后的布局组件，包含默认主题布局和自定义插槽
        return h(DefaultTheme.Layout, props, {
            // 在文档内容后添加 Giscus 评论组件
            'doc-after': () => h(GiscusComment),
        });
    },

    // 增强应用配置，初始化全局组件和其他功能
    async enhanceApp({ app, router }: { app: any, router: Router }) {
        // 注册全局组件
        app.component('BackToTop', BackToTop); // 返回顶部按钮组件
        app.component('Mermaid', Mermaid);       // Mermaid 图表组件
        app.component('MNavLinks', MNavLinks);   // 导航链接组件

        // 仅在浏览器环境中执行以下逻辑
        if (typeof window !== 'undefined') {
            // 监听路由变化，动态更新首页彩虹背景动画样式
            watch(
                () => router.route.data.relativePath,
                () => updateHomePageStyle(location.pathname === '/'),
                { immediate: true } // 立即执行，初始化时检查是否为首页
            );
        }

        // 在非 SSR（服务器端渲染）环境下加载 Live2D 看板娘
        if (!import.meta.env.SSR) {
            const { loadOml2d } = await import('oh-my-live2d');
            loadOml2d({
                models: live2dModels, // 加载预定义的 Live2D 模型
                initialStatus: "sleep", // 设置初始状态为休眠
            });
        }
    },

    // 设置组件的初始化逻辑
    setup() {
        // 获取当前路由信息
        const route = useRoute();

        // 定义图片缩放初始化函数
        const initZoom = () => {
            // 为页面中的图片添加 medium-zoom 缩放功能，背景色使用 VitePress 主题变量
            mediumZoom('.main img', { background: 'var(--vp-c-bg)' });
        };

        // 在组件挂载后初始化图片缩放
        onMounted(() => {
            initZoom();
        });

        // 监听路由路径变化，在下一个 tick 重新初始化图片缩放
        watch(
            () => route.path,
            () => nextTick(() => initZoom())
        );
    }
}

// 检查浏览器是否为不受支持的浏览器（Safari、Edge 或 Firefox）
function isUnsupportedBrowser(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    return (
        // 检测 Safari（排除 Chrome，因为 Chrome 的 UA 可能包含 Safari）
        (ua.includes('safari') && !ua.includes('chrome')) ||
        // 检测 Firefox
        ua.includes('firefox') ||
        // 检测 Edge（包括旧版和基于 Chromium 的新版 Edge）
        ua.includes('edge') || ua.includes('edg/')
    );
}

// 更新首页的彩虹背景动画样式
function updateHomePageStyle(value: boolean) {
    // 如果是 Safari、Edge 或 Firefox 浏览器，直接移除样式并返回
    if (isUnsupportedBrowser()) {
        if (homePageStyle) {
            homePageStyle.remove();
            homePageStyle = undefined;
        }
        return;
    }

    // 如果 value 为 true（表示当前是首页）且 homePageStyle 不存在，则添加彩虹动画样式
    if (value) {
        if (homePageStyle) return; // 避免重复添加

        homePageStyle = document.createElement('style');
        homePageStyle.innerHTML = `
            :root {
                animation: rainbow 10s linear infinite; // 应用彩虹背景动画，持续 10 秒，线性无限循环
            }`;
        // 将样式添加到文档的 body 中
        document.body.appendChild(homePageStyle);
    } else {
        // 如果 value 为 false（非首页）且 homePageStyle 存在，则移除样式
        if (!homePageStyle) return;
        homePageStyle.remove();
        homePageStyle = undefined;
    }
}