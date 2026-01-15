<template>
    <DefaultTheme.Layout v-bind="$attrs">
        <template #doc-after>
            <!-- Giscus 评论组件 -->
            <slot name="doc-after" />
        </template>
        
        <!-- 首页功能卡片前的插槽 -->
        <template #home-features-before>
            <slot name="home-features-before" />
        </template>
    </DefaultTheme.Layout>

    <!-- 返回顶部按钮组件 -->
    <BackToTop v-if="showBackToTop" />
</template>

<script setup lang="ts">
// 导入 VitePress 默认主题，以便在我们的自定义布局中使用它
import DefaultTheme from 'vitepress/theme';
// 导入 useData 来获取 VitePress 的全局响应式数据，例如 isDark
import { useData } from 'vitepress';
// 导入 nextTick 和 provide，用于 Vue 的 DOM 更新和依赖注入
import { computed, nextTick, provide } from 'vue';
// 导入定义的常量
import { HIDE_BACKTOTOP_PATHS } from '../utils/constants';

// 从 VitePress 的全局数据中解构出 isDark 状态，它是一个 ref，会实时反映当前的主题模式
const { isDark, page } = useData()

// 创建一个计算属性，用于判断是否应该显示 BackToTop 组件
const showBackToTop = computed(() => {
    // some() 方法检查 HIDE_BACKTOTOP_PATHS 数组中是否有任何一个路径与当前页面路径匹配
    const shouldHide = HIDE_BACKTOTOP_PATHS.some(hidePath => {
        // 移除配置路径开头的斜杠，以匹配 relativePath 的格式
        const formattedPath = hidePath.startsWith('/') ? hidePath.substring(1) : hidePath;
        // 检查当前页面的相对路径是否以配置的路径开头
        return page.value.relativePath.startsWith(formattedPath);
    });
    // 如果不应该隐藏，则返回 true (显示组件)
    return !shouldHide;
})

/**
 * 检查浏览器是否支持 View Transitions API。
 * @returns {boolean} 如果支持则返回 true，否则返回 false。
 * - 'startViewTransition' in document 检查 API 是否存在。
 * - window.matchMedia(...) 检查用户是否开启了"减少动态效果"的辅助功能，如果是，则不启用动画以尊重用户选择。
 */
const enableTransitions = (): boolean =>
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
</script>

<style>
/*
    View Transitions API 会创建一些伪元素来进行过渡。
    我们需要对它们进行样式设置。
  */
::view-transition-old(root),
::view-transition-new(root) {
    /* 禁用默认的淡入淡出动画，以便我们的 clip-path 动画能够完全控制效果 */
    animation: none;
    /* 确保混合模式是正常的，避免意外的颜色混合效果 */
    mix-blend-mode: normal;
}

/* 设置过渡视图的堆叠顺序 (z-index)。
    为了实现新主题"覆盖"旧主题的效果，新视图必须在旧视图的上方。
  */
::view-transition-old(root) {
    /* 旧视图放在下面 */
    z-index: 1;
}

::view-transition-new(root) {
    /* 新视图放在上面，使用一个足够大的值确保它在最顶层 */
    z-index: 9999;
}
</style>