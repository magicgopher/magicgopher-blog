<template>
    <div ref="container" class="live2d-container">
        <canvas ref="canvas"></canvas>
        <div class="fullscreen-button" @click="toggleFullscreen" :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'">
            <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, toRaw } from 'vue';

// 定义 props
const props = defineProps({
    modelUrl: {
        type: String,
        required: true,
    },
    scale: {
        type: Number,
        default: null, // 默认不进行缩放，交由组件自动计算
    },
    offsetX: {
        type: Number,
        default: 0, // X 轴偏移量
    },
    offsetY: {
        type: Number,
        default: 0, // Y 轴偏移量
    },
});

const container = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
let app: any = null; // Pixi 应用实例
const isFullscreen = ref(false); // 全屏状态

/**
 * 切换全屏
 */
const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        container.value?.requestFullscreen();
        isFullscreen.value = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        isFullscreen.value = false;
    }
};

/**
 * 监听 ESC 键退出全屏
 */
const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
        isFullscreen.value = false;
    }
};

/**
 * 动态加载 live2dcubismcore.js 脚本。
 */
function loadCubismCore(): Promise<void> {
    // @ts-ignore
    if (window.cubismCoreLoaded) return window.cubismCoreLoaded;
    // @ts-ignore
    window.cubismCoreLoaded = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${import.meta.env.BASE_URL}js/live2dcubismcore.js`;
        script.onload = () => resolve();
        script.onerror = (e) =>
            reject(new Error(`Failed to load cubism core script: ${e}`));
        document.head.appendChild(script);
    });
    // @ts-ignore
    return window.cubismCoreLoaded;
}

const initModel = async () => {
    try {
        await loadCubismCore();
        // @ts-ignore
        if (!window.Live2DCubismCore) {
            throw new Error('Cubism Core script loaded but not initialized correctly.');
        }

        const PIXI = await import('pixi.js');
        const { Live2DModel } = await import('pixi-live2d-display/cubism4');

        Live2DModel.registerTicker(PIXI.Ticker);

        if (!canvas.value || !container.value) return;

        if (app) {
            app.destroy(true);
        }

        app = new PIXI.Application({
            view: canvas.value,
            autoStart: true,
            resizeTo: container.value,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio || 2, // 设置渲染分辨率为设备像素比
            autoDensity: true, //自动调整视图大小，适配分辨率
            antialias: true, // 开启抗锯齿，让边缘更平滑
        });

        const modelPath = `${import.meta.env.BASE_URL}${props.modelUrl.startsWith('/')
                ? props.modelUrl.substring(1)
                : props.modelUrl
            }`;

        const model = await Live2DModel.from(modelPath, {
            autoInteract: true,
            onError: (e: Error) => {
                console.error('Live2D model loading error:', e);
            },
        });

        app.stage.addChild(toRaw(model));

        const resizeModel = () => {
            if (!container.value) return;
            const containerWidth = container.value.clientWidth;
            const containerHeight = container.value.clientHeight;

            model.anchor.set(0.5, 0.5);
            model.position.set(
                containerWidth / 2 + props.offsetX,
                containerHeight / 2 + props.offsetY
            );

            if (props.scale) {
                model.scale.set(props.scale);
            } else {
                const autoScale =
                    Math.min(
                        containerHeight / model.height,
                        containerWidth / model.width
                    ) * 0.8;
                model.scale.set(autoScale);
            }
        };

        resizeModel(); // 初始化时调整一次
        
        // 监听容器大小变化
        const resizeObserver = new ResizeObserver(resizeModel);
        resizeObserver.observe(container.value);


        model.on('pointerdown', (e: any) => {
            model.dragging = true;
            model._pointerX = e.data.global.x - model.x;
            model._pointerY = e.data.global.y - model.y;
        });
        model.on('pointermove', (e: any) => {
            if (model.dragging) {
                model.position.x = e.data.global.x - model._pointerX;
                model.position.y = e.data.global.y - model._pointerY;
            }
        });
        model.on('pointerup', () => (model.dragging = false));
    } catch (error) {
        console.error('Failed to initialize Live2D model:', error);
    }
};

onMounted(() => {
    initModel();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
    if (app) {
        app.destroy(true);
    }
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

</script>

<style scoped>
.live2d-container {
    position: relative; /* 为全屏按钮定位 */
    width: 100%;
    height: 800px;
    border-radius: 8px;
    border: 1px dashed var(--vp-c-divider);
    cursor: grab;
    overflow: hidden; /* 隐藏可能溢出的内容 */
}
.live2d-container:active {
    cursor: grabbing;
}

/* 全屏按钮样式 */
.fullscreen-button {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    cursor: pointer;
    color: var(--vp-c-text-2);
    
    /* 修改部分开始 */
    width: 36px;  /* 设置固定宽度 */
    height: 36px; /* 设置固定高度 */
    background-color: var(--vp-c-bg-soft);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s, color 0.3s;
    /* 修改部分结束 */
}

.fullscreen-button:hover {
    background-color: var(--vp-c-bg-mute);
    color: var(--vp-c-text-1);
}

/* 全屏时的样式 */
.live2d-container:fullscreen {
    border: none;
    border-radius: 0;
    background-color: var(--vp-c-bg);
}

/* 确保 SVG 图标尺寸正确 */
.fullscreen-button svg {
    width: 20px;
    height: 20px;
}
</style>