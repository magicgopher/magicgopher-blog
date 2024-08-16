<template>
    <div style="margin-top: 24px">
        <Giscus id="comments" repo="MagicGopher/MagicGopher-Blog" repoid="R_kgDOMNveng" category="General"
            categoryid="DIC_kwDOMNvens4ChhfK" mapping="title" term="Welcome to giscus!" reactionsenabled="1"
            emitmetadata="0" inputposition="top" loading="lazy" :theme="isDark ? 'dark' : 'light'" :key="fullPath">
        </Giscus>
    </div>
</template>

<script setup lang="ts">
import Giscus from '@giscus/vue';
import { useRoute, useData } from 'vitepress';
import { computed } from 'vue';

const route = useRoute();
const { isDark } = useData();

// 计算fullPath属性
const fullPath = computed(() => route.path);
</script>