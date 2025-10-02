<template>
    <!-- Live2D模型的容器，包含画布和加载状态提示 -->
    <div ref="container" class="live2d-container">
        <!-- 用于渲染Live2D模型的画布 -->
        <canvas ref="canvas"></canvas>

        <!-- 加载状态过渡动画 -->
        <Transition name="fade">
            <div v-if="loadingStatus !== 'success'" class="status-overlay">
                <!-- 加载中提示 -->
                <div v-if="loadingStatus === 'loading'" class="status-box">
                    <div class="spinner"></div>
                    <span class="status-text">模型加载中...</span>
                </div>
                <!-- 加载失败提示 -->
                <div v-if="loadingStatus === 'error'" class="status-box">
                    <div class="error-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </div>
                    <span class="status-text">模型加载失败 T_T</span>
                </div>
            </div>
        </Transition>

        <!-- 全屏切换按钮 -->
        <div class="fullscreen-button" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '进入全屏'">
            <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted, onUnmounted, toRaw, watch } from 'vue';

// 定义组件接收的属性，用于配置模型路径和显示效果
const props = defineProps({
    modelUrl: { type: String, required: true },
    scale: { type: Number, default: null },
    offsetX: { type: Number, default: 0 },
    offsetY: { type: Number, default: 0 },
});

// 创建对DOM元素的引用，用于操作容器和画布
const container = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
let app: any = null; // 用于存储Pixi.js应用实例
const isFullscreen = ref(false); // 控制全屏状态

// 管理模型加载状态
const loadingStatus = ref<'loading' | 'success' | 'error'>('loading');
const errorMessage = ref(''); // 存储加载错误信息

// 切换全屏模式
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

// 监听全屏状态变化
const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
        isFullscreen.value = false;
    }
};

// 加载Live2D核心脚本
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

// 初始化Live2D模型
const initModel = async () => {
    loadingStatus.value = 'loading';
    errorMessage.value = '';

    // 销毁旧的Pixi.js实例
    if (app) {
        app.destroy(true);
        app = null;
    }

    try {
        await loadCubismCore();
        if (!window.Live2DCubismCore) {
            throw new Error('Cubism Core script loaded but not initialized correctly.');
        }

        // 动态加载pixi.js和pixi-live2d-display
        const PIXI = await import('pixi.js');
        const { Live2DModel } = await import('pixi-live2d-display/cubism4');

        Live2DModel.registerTicker(PIXI.Ticker);

        if (!canvas.value || !container.value) return;

        // 初始化Pixi.js应用
        app = new PIXI.Application({
            view: canvas.value,
            autoStart: true,
            resizeTo: container.value,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio || 2,
            autoDensity: true,
            antialias: true,
        });

        // 处理模型路径
        let modelPath = '';
        if (props.modelUrl.startsWith('http')) {
            modelPath = props.modelUrl;
        } else {
            modelPath = `${import.meta.env.BASE_URL}${props.modelUrl.startsWith('/')
                ? props.modelUrl.substring(1)
                : props.modelUrl
                }`;
        }

        // 加载Live2D模型
        const model = await Live2DModel.from(modelPath, {
            autoInteract: true,
            onError: (e: Error) => {
                console.error('Live2D model loading error:', e);
                loadingStatus.value = 'error';
                errorMessage.value = e.message;
            },
        });

        if (loadingStatus.value === 'error') return;

        app.stage.addChild(toRaw(model));

        // 调整模型大小和位置
        const resizeModel = () => {
            if (!container.value || !model) return;
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
                const autoScale = Math.min(
                    containerHeight / model.height,
                    containerWidth / model.width
                ) * 0.8;
                model.scale.set(autoScale);
            }
        };

        resizeModel();

        // 监听容器大小变化以调整模型
        const resizeObserver = new ResizeObserver(resizeModel);
        resizeObserver.observe(container.value);

        // 添加模型拖拽交互
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

        loadingStatus.value = 'success';

    } catch (error: any) {
        console.error('Failed to initialize Live2D model:', error);
        loadingStatus.value = 'error';
        errorMessage.value = error.message;
    }
};

// 组件挂载时初始化模型并监听全屏变化
onMounted(() => {
    initModel();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
});

// 监听modelUrl变化以重新加载模型
watch(
    () => props.modelUrl,
    (newUrl, oldUrl) => {
        if (newUrl && newUrl !== oldUrl) {
            initModel();
        }
    }
);

// 组件卸载时清理资源
onUnmounted(() => {
    if (app) {
        app.destroy(true);
        app = null;
    }
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>
  
<style scoped>
/* Live2D容器样式，定义尺寸和交互效果 */
.live2d-container {
    position: relative;
    width: 100%;
    height: 800px;
    border-radius: 8px;
    border: 1px dashed var(--vp-c-divider);
    cursor: grab;
    overflow: hidden;
    /* 防止内容溢出 */
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
    width: 36px;
    height: 36px;
    background-color: var(--vp-c-bg-soft);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s, color 0.3s;
}

.fullscreen-button:hover {
    background-color: var(--vp-c-bg-mute);
    color: var(--vp-c-text-1);
}

.live2d-container:fullscreen {
    border: none;
    border-radius: 0;
    background-color: var(--vp-c-bg);
}

.fullscreen-button svg {
    width: 20px;
    height: 20px;
}

/* 加载状态覆盖层样式 */
.status-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--vp-c-bg-soft-translucent);
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