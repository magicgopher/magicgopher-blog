<template>
    <!-- 使用Vue的transition组件实现淡入淡出动画 -->
    <transition name="fade">
        <!-- 当isVisible为true时显示“返回顶部”按钮 -->
        <div v-if="isVisible" class="back-to-top" @click="scrollToTop" title="回到顶部">
            <!-- 进度圈 SVG，用于显示页面滚动进度 -->
            <svg class="progress-ring" width="56" height="56" viewBox="0 0 56 56">
                <!-- 进度圈的背景轨道，始终可见 -->
                <circle class="progress-ring__circle-bg" stroke-width="4" fill="transparent" r="26" cx="28" cy="28" />
                <!-- 动态进度圈，根据滚动百分比更新 -->
                <circle class="progress-ring__circle" stroke-width="4" fill="transparent" r="26" cx="28" cy="28"
                    :style="progressStyle" />
            </svg>
            <!-- 箭头图标 SVG，表示“返回顶部” -->
            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- 使用currentColor使箭头颜色可以通过CSS控制 -->
                <path d="M12 5L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </div>
    </transition>
</template>

<script setup>
// 引入Vue的响应式API和生命周期钩子
import { ref, onMounted, onUnmounted, computed } from 'vue';

// 定义响应式变量：控制按钮是否可见
const isVisible = ref(false);
// 定义响应式变量：存储页面滚动进度百分比
const scrollProgress = ref(0);
// 定义常量：当页面滚动超过300像素时显示按钮
const VISIBILITY_THRESHOLD = 300;

// 定义进度圈的半径和周长，用于计算动态进度
const radius = 26;
const circumference = 2 * Math.PI * radius;

// 计算属性：动态生成进度圈的样式，控制进度显示
const progressStyle = computed(() => {
    // 计算进度圈的偏移量，基于滚动百分比
    const offset = circumference - (scrollProgress.value / 100) * circumference;
    return {
        strokeDasharray: `${circumference} ${circumference}`, // 设置圆环的虚线样式
        strokeDashoffset: offset, // 控制进度显示的偏移量
    };
});

// 点击按钮时触发的函数，平滑滚动到页面顶部
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth', // 平滑滚动效果
    });
};

// 监听页面滚动事件的函数
const handleScroll = () => {
    // 获取当前滚动位置
    const scrollTop = window.scrollY;
    // 获取文档总高度
    const docHeight = document.documentElement.scrollHeight;
    // 获取窗口可视高度
    const winHeight = window.innerHeight;
    // 计算可滚动的高度
    const scrollableHeight = docHeight - winHeight;

    // 当滚动超过阈值时显示按钮
    isVisible.value = scrollTop > VISIBILITY_THRESHOLD;

    // 计算滚动进度百分比
    if (scrollableHeight > 0) {
        scrollProgress.value = (scrollTop / scrollableHeight) * 100;
    } else {
        scrollProgress.value = 0; // 防止除以零的情况
    }
};

// 组件挂载时添加滚动事件监听
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

// 组件卸载时移除滚动事件监听，防止内存泄漏
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* 返回顶部按钮的样式 */
.back-to-top {
    position: fixed; /* 固定定位在页面右下角 */
    bottom: calc(2rem + 70px); /* 距离底部2rem+70px */
    right: calc(2rem + 10px); /* 距离右边2rem+10px */
    width: 56px; /* 按钮宽度 */
    height: 56px; /* 按钮高度 */
    border-radius: 50%; /* 圆形按钮 */
    background-color: var(--vp-c-bg-soft); /* 使用主题变量定义背景色 */
    box-shadow: var(--vp-shadow-2); /* 添加阴影效果 */
    cursor: pointer; /* 鼠标悬停显示指针 */
    display: flex; /* 居中对齐内容 */
    justify-content: center;
    align-items: center;
    z-index: 1000; /* 确保按钮在其他元素之上 */
    transition: background-color 0.3s, transform 0.3s; /* 背景色和变换动画 */
}

/* 鼠标悬停时按钮背景色变化 */
.back-to-top:hover {
    background-color: var(--vp-c-bg-soft-up); /* 使用主题变量定义悬停背景色 */
}

/* 鼠标悬停时图标和进度圈透明度降低 */
.back-to-top:hover .icon,
.back-to-top:hover .progress-ring__circle {
    opacity: 0.7;
}

/* 进度圈的样式 */
.progress-ring {
    position: absolute; /* 绝对定位，覆盖整个按钮区域 */
    top: 0;
    left: 0;
    transform: rotate(-90deg); /* 旋转-90度使进度从顶部开始 */
}

/* 进度圈背景轨道的样式 */
.progress-ring__circle-bg {
    stroke: var(--vp-c-divider); /* 使用主题变量定义背景轨道颜色 */
}

/* 动态进度圈的样式 */
.progress-ring__circle {
    stroke: #10B981; /* 进度圈颜色（绿色） */
    transition: stroke-dashoffset 0.1s linear, opacity 0.3s ease; /* 进度和透明度动画 */
}

/* 箭头图标的样式 */
.icon {
    color: #10B981; /* 图标颜色（绿色） */
    transition: opacity 0.3s ease; /* 透明度动画 */
}

/* 淡入淡出动画的过渡效果 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease; /* 动画持续0.4秒 */
}

/* 淡入淡出动画的初始和结束状态 */
.fade-enter-from,
.fade-leave-to {
    opacity: 0; /* 完全透明 */
}

/* 移动端（屏幕宽度小于 1024px）隐藏组件 */
@media (max-width: 1024px) {
    .back-to-top {
        display: none;
    }
}
</style>