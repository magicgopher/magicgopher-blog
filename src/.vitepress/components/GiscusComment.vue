<template>
    <div style="margin-top: 24px">
        <Giscus
            id="comments"
            repo="MagicGopher/MagicGopher-Blog" 
            repoid="R_kgDOMNveng"
            category="General"
            categoryid="DIC_kwDOMNvens4ChhfK"
            mapping="title"
            term="Welcome to giscus!"
            reactionsenabled="1"
            emitmetadata="0"
            inputposition="top"
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

const route = useRoute();
const { isDark } = useData();
</script>