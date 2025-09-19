// 导入 medium-zoom 库，用于图片缩放功能
import mediumZoom from 'medium-zoom';
// 导入 VitePress 默认主题
import DefaultTheme from "vitepress/theme";
// 导入 Vue 的相关 hooks，用于组件生命周期和响应式处理
import { h, onMounted, watch, nextTick } from 'vue';
// 导入 VitePress 的路由和数据 hooks，用于获取路由信息和 frontmatter 数据
import { useRoute, useData, Router, inBrowser } from 'vitepress';
// 导入 Live2D 模型配置常量
import { LIVE2D_MODELS_PATH, HIDE_LIVE2D_PATHS } from '../utils/constants';
// 导入自定义组件：返回顶部按钮、Giscus 评论、Mermaid 图表和导航链接
import BackToTop from '@/components/BackToTop.vue';
import GiscusComment from '@/components/GiscusComment.vue';
import Mermaid from '@/components/Mermaid.vue';
import MNavLinks from '@/components/MNavLinks.vue';
import MyLayout from '@/components/MyLayout.vue';
import Live2DViewer from '@/components/Live2DViewer.vue';
// 导入首页卡片鼠标追踪组件
import HomeFeatureBefore from '@/components/HomeFeatureBefore.vue';
// 顶部进度条组件
import { NProgress } from 'nprogress-v2/dist/index.js';
// 进度条样式
import 'nprogress-v2/dist/index.css';
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
        return h(MyLayout, props, {
            // 在文档内容后添加 Giscus 评论组件
            'doc-after': () => h(GiscusComment),
            // 在首页功能卡片之前添加鼠标追踪组件
            'home-features-before': () => h(HomeFeatureBefore),
        });
    },

    // 增强应用配置，初始化全局组件和其他功能
    async enhanceApp({ app, router }: { app: any, router: Router }) {
        // 注册全局组件
        app.component('BackToTop', BackToTop);
        app.component('Mermaid', Mermaid);
        app.component('MNavLinks', MNavLinks);
        app.component('Live2DViewer', Live2DViewer);
        // 注册首页卡片鼠标追踪组件
        app.component('HomeFeatureBefore', HomeFeatureBefore);

        if (inBrowser) {
            NProgress.configure({ showSpinner: false })
            router.onBeforeRouteChange = () => {
                NProgress.start() // 开始进度条
            }
            router.onAfterRouteChanged = () => {
                NProgress.done() // 停止进度条
            }
        }

        // 彩虹背景动画样式
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
            const { loadOml2d } = await import('oh-my-live2d'); ``
            loadOml2d({
                models: LIVE2D_MODELS_PATH, // 加载预定义的 Live2D 模型
                initialStatus: "sleep", // 设置初始状态为休眠
            });

            // 监听路由，在 Live2D 目录下的页面隐藏看板娘
            watch(
                () => router.route.data.relativePath,
                (path) => {
                    nextTick(() => {
                        const stage = document.getElementById('oml2d-stage');
                        if (stage) {
                            // 【修改】在比较前，移除 HIDE_LIVE2D_PATHS 中每个路径开头的斜杠
                            const shouldHide = HIDE_LIVE2D_PATHS.some(hidePath => {
                                const formattedPath = hidePath.startsWith('/') ? hidePath.substring(1) : hidePath;
                                return path.startsWith(formattedPath);
                            });

                            if (shouldHide) {
                                // 隐藏看板娘
                                stage.style.opacity = '0';
                                stage.style.visibility = 'hidden';
                                stage.style.pointerEvents = 'none';
                            } else {
                                // 显示看板娘
                                stage.style.opacity = '1';
                                stage.style.visibility = 'visible';
                                stage.style.pointerEvents = 'auto';
                            }
                        }
                    });
                },
                { immediate: true }
            );
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

/**
 * 检查浏览器是否为不受支持的浏览器（Safari、Edge 或 Firefox）
 * 
 * @returns boolean - 返回 true 表示当前浏览器不受支持（Safari、Edge 或 Firefox），返回 false 表示支持
 */
function isUnsupportedBrowser(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    return (
        // 检测 Safari（排除 Chrome，因为 Chrome 的 UA 可能包含 Safari）
        (ua.includes('safari') && !ua.includes('chrome')) ||
        // 检测 Firefox
        ua.includes('firefox')
    );
}

/**
 * 更新首页的彩虹背景动画样式
 * 
 * @param value - boolean，表示当前是否为首页（true 表示首页，false 表示非首页）
 * @returns void
 */
function updateHomePageStyle(value: boolean) {
    // 如果是 Safari、Edge 或 Firefox 浏览器，直接移除样式并返回
    if (isUnsupportedBrowser()) {
        if (homePageStyle) {
            // 如果 homePageStyle 存在，则移除样式元素并清空变量
            homePageStyle.remove();
            homePageStyle = undefined;
        }
        return;
    }

    // 如果 value 为 true（表示当前是首页）且 homePageStyle 不存在，则添加彩虹动画样式
    if (value) {
        if (homePageStyle) return; // 避免重复添加样式

        // 创建新的 <style> 元素
        homePageStyle = document.createElement('style');
        // 设置彩虹背景动画样式，应用到 :root 伪类
        homePageStyle.innerHTML = `
            :root {
                animation: rainbow 10s linear infinite; // 应用彩虹背景动画，持续 10 秒，线性无限循环
            }`;
        // 将样式元素添加到文档的 <body> 中
        document.body.appendChild(homePageStyle);
    } else {
        // 如果 value 为 false（非首页）且 homePageStyle 存在，则移除样式
        if (!homePageStyle) return; // 如果样式不存在，直接返回
        homePageStyle.remove();
        homePageStyle = undefined; // 清空 homePageStyle 变量
    }
}