<template>
    <!-- mermaid渲染 -->
    <div v-html="svgRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { render } from '../configs/mermaid';

// 接收来自父组件的数据
const props = defineProps({
    id: String,
    code: String,
});

// 定义变量
const svgRef = ref('');

// 渲染函数
const renderMermaid = async () => {
    if (props.id && props.code) {
        svgRef.value = await render(props.id, decodeURIComponent(props.code));
    }
};

// 监听主题变化
const handleThemeChange = () => {
    renderMermaid();
};

// 组件挂载时渲染
onMounted(async () => {
    await renderMermaid();
    
    // 监听主题切换事件
    if (typeof window !== 'undefined') {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    handleThemeChange();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // 保存 observer 引用以便清理
        (window as any).__mermaidObserver = observer;
    }
});

// 组件卸载时清理
onUnmounted(() => {
    if (typeof window !== 'undefined' && (window as any).__mermaidObserver) {
        (window as any).__mermaidObserver.disconnect();
        delete (window as any).__mermaidObserver;
    }
});
</script>

<style scoped>
/* 样式配置 */
</style>