<template>
    <!-- 这里没有任何组件 -->
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    // 可用的颜色值 - 你可以根据需要自定义这些颜色
    const colors = ['#f00', '#0f0', '#f0f', '#0ff', '#FE7300', '#008EFF', 'red', 'red', 'red', 'red', 'red'];

    // 父元素
    const parent = document.querySelector<HTMLDivElement>('.VPHomeFeatures');

    // 为每个卡片添加鼠标追踪效果
    document.querySelectorAll<HTMLDivElement>('.VPHomeFeatures .VPFeature').forEach((card, i) => {
        // 为每个卡片设置自己的颜色变量
        card.style.setProperty('--color', colors[i % colors.length]);

        // 添加鼠标移动事件监听器
        card.addEventListener('mousemove', function (e) {
            // 计算鼠标相对于卡片的位置
            const x = e.pageX - this.offsetLeft;
            const y = e.pageY - (parent?.offsetTop || 0) - this.offsetTop;

            // 设置CSS变量，用于定位光晕效果
            this.style.setProperty('--x', x + 'px');
            this.style.setProperty('--y', y + 'px');
        });
    });
});
</script>

<style scoped>
/* 这里没有任何样式 */
</style>