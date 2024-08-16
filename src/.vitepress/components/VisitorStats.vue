<template>
    <div class="visitor-stats">
        <div class="left-content">
            <span>✨本站总访问量 <span id="busuanzi_value_site_pv"></span> 次✨</span>
        </div>
        <div class="center-content">
            <img src="/images/gif/cat-roomba.gif" alt="Visitor Stats GIF" width="40" />
        </div>
        <div class="right-content">
            <span>✨本站访客数 <span id="busuanzi_value_site_uv"></span> 人次✨</span>
        </div>
    </div>
</template>

<script setup lang="ts">
// 如果需要导入任何模块或定义任何变量/函数，可以在这里添加
// 例如：
// import { ref } from 'vue';
// const someValue = ref(0);
</script>

<style>
.visitor-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    background-color: var(--vp-c-default-soft);
    padding: 30px;
    margin-top: 20px;
}

.left-content,
.right-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.center-content {
    flex: 0 0 auto;
    margin: 0 20px;
}

.center-content img {
    max-width: 100px;
    height: auto;
}
</style>