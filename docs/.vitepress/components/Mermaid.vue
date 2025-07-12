<template>
    <!-- mermaid渲染 -->
    <div v-html="svgRef">
    </div>
</template>

<script setup ts>
import { ref, onMounted } from 'vue';
import { render } from '../configs/mermaid';

// 接收来自父组件的数据
const props = defineProps({
    id: String,
    code: String,
})

// 渲染
onMounted(async () => {
    svgRef.value = await render(props.id, decodeURIComponent(props.code));
})

// 定义变量
const svgRef = ref('');
</script>

<style scoped>
/* 样式配置 */
</style>