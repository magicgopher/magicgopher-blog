---
layout: doc
layoutClass: m-nav-layout
sidebar: false
prev: false
next: false
outline: [2, 3, 4]
---

<style src="./nav.scss"></style>

<script setup>
import { NAV_DATA } from './data'
</script>


# 导航

<MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>

<br />

::: tip 声明
该导航由 maomao 开发，如有引用、借鉴的请保留版权声明：https://github.com/maomao1996/vitepress-nav-template
:::