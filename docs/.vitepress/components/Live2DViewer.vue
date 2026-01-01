<template>
    <div ref="container" class="live2d-container">
        <canvas ref="canvas"></canvas>

        <Transition name="fade">
            <div v-if="loadingStatus !== 'success'" class="status-overlay">
                <div v-if="loadingStatus === 'loading'" class="status-box">
                    <div class="spinner"></div>
                    <span class="status-text">模型加载中...</span>
                </div>
                <div v-else-if="loadingStatus === 'error'" class="status-box">
                    <div class="error-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </div>
                    <span class="status-text">模型加载失败 T_T</span>
                    <button class="retry-button" @click="initModel">重新加载</button>
                </div>
            </div>
        </Transition>

        <div class="controls-container">
            <div v-if="isFullscreen" class="scale-controls">
                <button @click="decreaseScale" title="缩小" class="control-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <button @click="increaseScale" title="放大" class="control-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>

            <button v-if="!isMobile" class="control-button" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '进入全屏'">
                <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <path
                        d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                        d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, toRaw, watch, nextTick } from 'vue';
import PIXI from 'pixi.js';

const props = defineProps({
    modelUrl: { type: String, required: true },
    scale: { type: Number, default: null },
    offsetX: { type: Number, default: 0 },
    offsetY: { type: Number, default: 0 },
});

const container = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
let app: PIXI.Application | null = null;
let live2dModel: any = null;
const loadingStatus = ref<'loading' | 'success' | 'error'>('loading');
const isFullscreen = ref(false);
const isMobile = ref(false);
const currentScale = ref(props.scale ?? 0.1);

const increaseScale = () => {
    currentScale.value = parseFloat((currentScale.value + 0.01).toFixed(2));
};
const decreaseScale = () => {
    currentScale.value = parseFloat(Math.max(0.01, currentScale.value - 0.01).toFixed(2));
};

const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        container.value?.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

const handleFullscreenChange = async () => {
    const isCurrentlyFullscreen = !!document.fullscreenElement;
    isFullscreen.value = isCurrentlyFullscreen;

    if (!isCurrentlyFullscreen) {
        currentScale.value = props.scale ?? 0.1;
    }
    
    // --- 关键修改：在全屏状态改变后，重新计算模型位置 ---
    await nextTick();
    resizeModel();
};

function loadCubismCore(): Promise<void> {
    if (window.cubismCoreLoaded) return window.cubismCoreLoaded;
    window.cubismCoreLoaded = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${import.meta.env.BASE_URL}js/live2dcubismcore.js`;
        script.onload = () => resolve();
        script.onerror = (e) => reject(new Error(`Failed to load cubism core script: ${e}`));
        document.head.appendChild(script);
    });
    return window.cubismCoreLoaded;
}

const initModel = async () => {
    loadingStatus.value = 'loading';
    await nextTick();
    if (live2dModel) {
        app?.stage.removeChild(live2dModel);
        live2dModel.destroy();
        live2dModel = null;
    }

    try {
        await loadCubismCore();
        if (!window.Live2DCubismCore) throw new Error('Cubism Core not available on window.');

        const PIXI = await import('pixi.js');
        const { Live2DModel } = await import('pixi-live2d-display/cubism4');

        if (!canvas.value || !container.value) return;
        Live2DModel.registerTicker(PIXI.Ticker);

        if (!app) {
            app = new PIXI.Application({
                view: canvas.value,
                autoStart: true,
                resizeTo: container.value,
                backgroundAlpha: 0,
                resolution: Math.max(window.devicePixelRatio || 1, 2),
                autoDensity: true,
                antialias: true,
            });
            // 监听PIXI应用的resize事件，自动调整模型
            app.renderer.on('resize', resizeModel);
        }

        const modelPath = props.modelUrl.startsWith('http')
            ? props.modelUrl
            : `${import.meta.env.BASE_URL}${props.modelUrl.startsWith('/') ? props.modelUrl.slice(1) : props.modelUrl}`;

        const model = await Live2DModel.from(modelPath, {
            autoInteract: true,
            onError: () => {
                if (loadingStatus.value !== 'success') {
                    loadingStatus.value = 'error';
                }
            },
        });

        if ((loadingStatus.value as string) === 'error') return;

        live2dModel = model;
        app.stage.addChild(toRaw(live2dModel));

        resizeModel();

        live2dModel.on('pointerdown', (e: any) => {
            live2dModel.dragging = true;
            live2dModel._pointerX = e.data.global.x - live2dModel.x;
            live2dModel._pointerY = e.data.global.y - live2dModel.y;
        });
        live2dModel.on('pointermove', (e: any) => {
            if (live2dModel.dragging) {
                live2dModel.position.x = e.data.global.x - live2dModel._pointerX;
                live2dModel.position.y = e.data.global.y - live2dModel._pointerY;
            }
        });
        live2dModel.on('pointerup', () => (live2dModel.dragging = false));
        live2dModel.on('pointerupoutside', () => (live2dModel.dragging = false));

        loadingStatus.value = 'success';
    } catch (error) {
        console.error('Failed to initialize Live2D model:', error);
        loadingStatus.value = 'error';
    }
};

const resizeModel = () => {
    if (!container.value || !live2dModel) return;
    const { clientWidth: cw, clientHeight: ch } = container.value;
    
    // 锚点设置在模型中心
    live2dModel.anchor.set(0.5, 0.5);
    // 定位到容器中心，并应用偏移
    live2dModel.position.set(cw / 2 + props.offsetX, ch / 2 + props.offsetY);

    if (props.scale) {
        live2dModel.scale.set(currentScale.value);
    } else {
        live2dModel.scale.set(Math.min(cw / live2dModel.width, ch / live2dModel.height) * 0.9);
    }
};

onMounted(() => {
    isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    initModel();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
    if (app) {
        app.destroy(true, { children: true, texture: true, baseTexture: true });
        app = null;
    }
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

watch(currentScale, (newScale) => {
    if (live2dModel && props.scale) {
        live2dModel.scale.set(newScale);
    }
});

watch(() => props.scale, (newScale) => {
    currentScale.value = newScale ?? 0.1;
});

watch(() => props.modelUrl, (newUrl, oldUrl) => {
    if (newUrl && newUrl !== oldUrl) {
        initModel();
    }
});

</script>

<style scoped>
/* Live2D容器样式 */
.live2d-container {
    position: relative;
    width: 100%;
    height: 800px;
    border-radius: 8px;
    border: 1px dashed var(--vp-c-divider);
    cursor: grab;
    overflow: hidden;
}

.live2d-container:active {
    cursor: grabbing;
}

/* 控制按钮的通用样式 */
.control-button {
    cursor: pointer;
    color: var(--vp-c-text-2);
    width: 36px;
    height: 36px;
    background-color: var(--vp-c-bg-soft);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s, color 0.3s;
    border: none;
    padding: 0;
}

.control-button:hover {
    background-color: var(--vp-c-bg-mute);
    color: var(--vp-c-text-1);
}

.control-button svg {
    width: 20px;
    height: 20px;
}

/* 右上角控制按钮容器 */
.controls-container {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
}

/* 缩放控制按钮组 */
.scale-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.live2d-container:fullscreen {
    border: none;
    border-radius: 0;
    background-color: var(--vp-c-bg);
}

/* 加载状态覆盖层样式 */
.status-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(var(--vp-c-bg-rgb), 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

/* 加载或错误提示框样式 */
.status-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 32px;
    background-color: var(--vp-c-bg-soft);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--vp-c-divider);
    color: var(--vp-c-text-1);
}

.status-text {
    font-size: 1em;
    font-weight: 500;
}

/* 错误状态图标样式 */
.error-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--vp-c-red-soft);
    color: var(--vp-c-red-1);
    border-radius: 50%;
}

.error-icon svg {
    width: 28px;
    height: 28px;
}

/* 加载动画样式 */
.spinner {
    width: 48px;
    height: 48px;
    border: 5px solid var(--vp-c-brand-soft);
    border-top-color: var(--vp-c-brand-1);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* 重新加载按钮样式 */
.retry-button {
    margin-top: 8px;
    padding: 8px 16px;
    border: 1px solid var(--vp-c-brand-1);
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s, color 0.3s;
}

.retry-button:hover {
    background-color: var(--vp-c-brand-1);
    color: var(--vp-c-bg-soft);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>