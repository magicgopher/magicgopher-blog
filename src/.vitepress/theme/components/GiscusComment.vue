<template>
    <div style="margin-top: 24px">
        <Giscus id="comments" repo="MagicGopher/MagicGopher-Blog" repoid="R_kgDOMNveng" category="General"
            categoryid="DIC_kwDOMNvens4ChhfK" mapping="title" term="Welcome to giscus!" reactionsenabled="1"
            emitmetadata="0" inputposition="top" loading="lazy" :theme="isDark ? 'dark' : 'light'" :key="fullPath">
        </Giscus>
    </div>
</template>

<script setup>
import Giscus from '@giscus/vue';
import { useRoute, useData } from 'vitepress';

const route = useRoute();
const { isDark } = useData();
</script>