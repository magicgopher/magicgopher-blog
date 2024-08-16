<template>
  <!-- 返回顶部按钮容器，仅在showBackTop为true时显示，并根据是否为移动端设置样式 -->
  <div class="back-top" v-show="showBackTop" :class="{ 'mobile': isMobile }">
    <button class="back-top-btn" @click="scrollToTop">
      <div class="progress-circle">
        <!-- 显示一个环形进度条，用于表示滚动位置 -->
        <svg class="progress-svg" viewBox="0 0 100 100">
          <circle class="progress-circle-bg" cx="50" cy="50" r="45" />
          <circle class="progress-circle-fill" cx="50" cy="50" r="45" :stroke-dasharray="circumference" :style="{ 'stroke-dashoffset': circumference - progress * circumference }" />
        </svg>
      </div>
      <!-- 返回顶部按钮图标 -->
      <svg class="rocket-svg" style="width: 2em; height: 2em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M733.996047 446.190155C737.993081 188.384531 524.718673 71.574129 510.388293 64.019059l0-0.398066c0 0-0.12996 0.066515-0.381693 0.197498-0.251733-0.130983-0.381693-0.197498-0.381693-0.197498l0 0.398066c-14.329357 7.55507-227.604788 124.365472-223.607754 382.171096-43.427068 27.916816-88.921215 77.54819-81.683371 163.367765s90.989317 142.68777 123.042337 139.586129 22.747073-26.883277 22.747073-26.883277l10.991332-44.460608c0 0 47.255257 71.478961 62.419631 71.464635 13.604856-1.085728 78.347392-0.118704 86.089727 0.002047l0 0.01228c0 0 0.138146-0.002047 0.381693-0.00614 0.24457 0.004093 0.381693 0.00614 0.381693 0.00614l0-0.01228c7.742335-0.12075 72.484871-1.087774 86.089727-0.002047 15.165398 0.014326 62.420655-71.464635 62.420655-71.464635l10.991332 44.460608c0 0-9.305947 23.781636 22.747073 26.883277 32.05302 3.101641 115.804493-53.766554 123.042337-139.586129S777.423115 474.107995 733.996047 446.190155zM510.0066 442.395736c-6.070252-0.085958-85.383646-2.979868-92.675726-95.122451 2.654456-87.596034 86.430488-95.333252 92.675726-95.788623 6.245238 0.455371 90.02127 8.191566 92.675726 95.788623C595.390245 439.415868 516.077875 442.308755 510.0066 442.395736zM463.170898 886.662075c0 10.469446-8.487302 18.955724-18.955724 18.955724l0 0c-10.469446 0-18.955724-8.487302-18.955724-18.955724l0-93.747127c0-10.469446 8.487302-18.955724 18.955724-18.955724l0 0c10.469446 0 18.955724 8.487302 18.955724 18.955724L463.170898 886.662075zM532.791535 937.412946c0 10.611685-8.602935 19.21462-19.21462 19.21462l0 0c-10.611685 0-19.21462-8.602935-19.21462-19.21462L494.362294 797.998733c0-10.611685 8.602935-19.21462 19.21462-19.21462l0 0c10.611685 0 19.21462 8.602935 19.21462 19.21462L532.791535 937.412946zM596.897575 864.603687c0 10.469446-8.487302 18.955724-18.955724 18.955724l0 0c-10.469446 0-18.955724-8.487302-18.955724-18.955724l0-66.86385c0-10.469446 8.487302-18.955724 18.955724-18.955724l0 0c10.469446 0 18.955724 8.487302 18.955724 18.955724L596.897575 864.603687z"  />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
  name: 'BackTop',
  setup() {
    const progress = ref(0);
    const isMobile = ref(false);
    const showBackTop = ref(false);
    const circumference = 2 * Math.PI * 45;
    const isAtBottom = ref(false);

    const checkIsMobile = () => {
      isMobile.value = window.innerWidth < 768;
    };

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progress.value = scrollTop / scrollHeight;
      showBackTop.value = scrollTop > 300;
      isAtBottom.value = scrollTop >= scrollHeight;
      if (isAtBottom.value) {
        progress.value = 1;
      }
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    onMounted(() => {
      checkIsMobile();
      window.addEventListener('scroll', handleScroll);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      progress,
      isMobile,
      showBackTop,
      circumference,
      isAtBottom,
      scrollToTop
    };
  }
});
</script>

<style>
/* 定义全局 CSS 变量 */
:root {
  --back-top-mobile-right: 30px; /* 移动设备下,按钮距右侧30px */
  --back-top-mobile-bottom: 80px; /* 移动设备下,按钮距底部80px */
  --back-top-desktop-right: 40px; /* 桌面设备下,按钮距右侧40px */
  --back-top-desktop-bottom: 40px; /* 桌面设备下,按钮距底部40px */
}

/* 返回顶部按钮容器,固定在页面右下角 */
.back-top {
  position: fixed; /* 将按钮容器固定在页面上 */
  z-index: 999; /* 设置按钮的层级为最高 */
  right: var(--back-top-desktop-right); /* 按钮距右侧的距离 */
  bottom: var(--back-top-desktop-bottom); /* 按钮距底部的距离 */
  opacity: 1; /* 按钮初始透明度为1,即完全可见 */
  transition: opacity 0.3s ease; /* 按钮透明度变化有0.3秒的过渡动画 */
}

/* 在移动设备上,按钮的尺寸和位置会改变 */
@media (max-width: 768px) {
  .back-top {
    right: var(--back-top-mobile-right); /* 移动设备下,按钮距右侧的距离 */
    bottom: var(--back-top-mobile-bottom); /* 移动设备下,按钮距底部的距离 */
  }

  .back-top-btn {
    width: 44px; /* 移动设备下,按钮宽度为44px */
    height: 44px; /* 移动设备下,按钮高度为44px */
  }

  .back-top-btn svg {
    width: 18px; /* 移动设备下,按钮内部图标宽度为18px */
    height: 18px; /* 移动设备下,按钮内部图标高度为18px */
  }
}

/* 当按钮隐藏时,设置不透明度为0并禁用指针事件 */
.back-top.hide {
  opacity: 0; /* 将按钮设置为完全透明 */
  pointer-events: none; /* 禁用按钮的指针事件,使其不可点击 */
}

/* 返回顶部按钮样式 */
.back-top-btn {
  display: flex; /* 使用Flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 52px; /* 按钮宽度为52px */
  height: 52px; /* 按钮高度为52px */
  border-radius: 50%; /* 按钮为圆形 */
  transition: all 0.3s ease; /* 所有样式变化有0.3秒的过渡动画 */
}

/* 按钮上的环形进度条容器 */
.back-top-btn .progress-circle {
  position: absolute; /* 将进度条容器设置为绝对定位 */
  width: 100%; /* 进度条容器宽度占满按钮 */
  height: 100%; /* 进度条容器高度占满按钮 */
}

/* 环形进度条SVG */
.back-top-btn .progress-svg {
  width: 100%; /* 进度条SVG宽度占满容器 */
  height: 100%; /* 进度条SVG高度占满容器 */
}

/* 进度条背景 */
.back-top-btn .progress-circle-bg {
  fill: none; /* 填充为透明 */
  stroke: transparent; /* 边框颜色为透明 */
  stroke: #ddd; /* 边框颜色为透明 */
  stroke-width: 6px; /* 边框宽度为6px */
}

/* 进度条填充 */
.back-top-btn .progress-circle-fill {
  fill: none; /* 填充为透明 */
  stroke: #6DB33F; /* 进度条填充颜色为绿色 */
  stroke-width: 6px; /* 进度条宽度为6px */
  transform: rotate(-90deg); /* 进度条起始位置为-90度 */
  transform-origin: center center; /* 进度条旋转中心为容器中心 */
}

/* 返回顶部按钮图标样式 */
.back-top-btn svg {
  width: 20px; /* 图标宽度为20px */
  height: 20px; /* 图标高度为20px */
  fill: none; /* 填充为透明 */
}

/* 火箭图标样式 */
.rocket-svg {
  color: #6DB33F; /* 火箭图标颜色为绿色 */
}
</style>