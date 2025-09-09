<template>
    <DefaultTheme.Layout v-bind="$attrs">
    </DefaultTheme.Layout>
</template>

<script setup lang="ts">
// 导入 VitePress 默认主题，以便在我们的自定义布局中使用它
import DefaultTheme from 'vitepress/theme';
// 导入 useData 来获取 VitePress 的全局响应式数据，例如 isDark
import { useData } from 'vitepress';
// 导入 nextTick 和 provide，用于 Vue 的 DOM 更新和依赖注入
import { nextTick, provide } from 'vue';

// 从 VitePress 的全局数据中解构出 isDark 状态，它是一个 ref，会实时反映当前的主题模式
const { isDark } = useData()

/**
 * 检查浏览器是否支持 View Transitions API。
 * @returns {boolean} 如果支持则返回 true，否则返回 false。
 * - 'startViewTransition' in document 检查 API 是否存在。
 * - window.matchMedia(...) 检查用户是否开启了“减少动态效果”的辅助功能，如果是，则不启用动画以尊重用户选择。
 */
const enableTransitions = () =>
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches

// 使用 provide API 来覆盖默认主题中名为 'toggle-appearance' 的函数。
// 这样，当用户点击导航栏的主题切换按钮时，就会执行我们这里的自定义逻辑。
provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
    // 如果浏览器不支持过渡动画，则执行原始的、无动画的切换逻辑
    if (!enableTransitions()) {
        isDark.value = !isDark.value
        return
    }

    // 计算剪裁路径（clip-path）的起始和结束状态
    const clipPath = [
        // 1. 起始状态：一个半径为 0px 的圆，圆心在鼠标点击的位置 (x, y)
        `circle(0px at ${x}px ${y}px)`,
        // 2. 结束状态：一个足够大的圆，能够完全覆盖整个屏幕。
        //    我们通过计算点击点到屏幕最远角落的距离（使用勾股定理 Math.hypot）来得到这个圆的半径。
        `circle(${Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        )}px at ${x}px ${y}px)`
    ]

    // 捕获切换前的状态，这对于解决闪烁问题和判断动画逻辑至关重要
    const wasDark = isDark.value;

    // 启动视图过渡
    await document.startViewTransition(async () => {
        // 这是解决“闪烁”问题的核心：
        // 我们在 API 捕获新状态截图之前，手动、同步地为 <html> 元素切换 'dark' class。
        // 这样可以确保背景色在截图时已经是正确的颜色。
        document.documentElement.classList.toggle('dark', !wasDark);

        // 更新 VitePress 的 isDark 状态，这将触发 Vue 组件和其他内部逻辑的更新
        isDark.value = !wasDark;

        // 等待 Vue 完成 DOM 的更新
        await nextTick();
    }).ready // .ready 会在过渡动画的准备阶段完成后 resolve

    // 当过渡准备好后，我们为它添加自定义的 clip-path 动画
    document.documentElement.animate(
        {
            // 动画的关键帧：从 clipPath 数组的第一个值（小圆）变化到第二个值（大圆）
            clipPath: clipPath,
        },
        {
            duration: 600, // 动画持续时间
            easing: 'ease-in', // 动画缓动函数
            fill: 'forwards', // 动画完成后保持最后的状态
            // 指定这个动画应用在哪个伪元素上。
            // 我们希望新主题“覆盖”旧主题，所以动画总是作用在 ::view-transition-new(root) 上。
            pseudoElement: '::view-transition-new(root)',
        }
    )
})
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
    为了实现新主题“覆盖”旧主题的效果，新视图必须在旧视图的上方。
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