<template>
    <div style="margin-top: 24px">
        <Giscus
            id="comments"
            repo="magicgopher/magicgopher-blog"
            repoId="R_kgDOMNveng"
            category="General"
            categoryId="DIC_kwDOMNvens4ChhfK"
            mapping="title"
            term="Welcome to giscus!"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            loading="lazy"
            lang="zh-CN"
            :theme="isDark ? 'dark' : 'light'"
            :key="route.path"
        ></Giscus>
    </div>
</template>

<script lang="ts" setup>
import Giscus from '@giscus/vue';
import { useRoute, useData } from 'vitepress';

// 使用 useRoute() 获取当前路由信息
const route = useRoute();
// 使用 useData() 获取数据，这里示例中获取了 isDark 属性
const { isDark } = useData();
</script>