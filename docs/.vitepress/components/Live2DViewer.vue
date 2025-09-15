<template>
    <!-- Live2D Viewer -->
    <div ref="container" class="live2d-container">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, toRaw } from 'vue';
import { useData } from 'vitepress';

// 定义 props
const props = defineProps({
    modelUrl: {
        type: String,
        required: true,
    },
});

const { isDark } = useData();
const container = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
let app: any = null; // Pixi 应用实例

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

        // 对于 pixi.js v7 + pixi-live2d-display v0.4.0，这行代码是必需的
        Live2DModel.registerTicker(PIXI.Ticker);

        if (!canvas.value || !container.value) return;

        if (app) {
            app.destroy(true);
        }

        // 使用 Pixi.js v7 的构造函数方式进行初始化
        app = new PIXI.Application({
            view: canvas.value,
            autoStart: true,
            resizeTo: container.value,
            backgroundAlpha: 0,
        });

        // 使用 VitePress 的 base path 确保模型路径正确
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

        // 调整模型位置和大小
        const containerWidth = container.value.clientWidth;
        const containerHeight = container.value.clientHeight;

        // 设置锚点
        model.anchor.set(0.5, 0.5);

        model.position.set(containerWidth / 2, containerHeight / 2);

        const scale =
            Math.min(
                containerHeight / model.height,
                containerWidth / model.width
            ) * 0.8;
        model.scale.set(scale);

        // 添加拖拽交互
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

onMounted(initModel);

onUnmounted(() => {
    if (app) {
        app.destroy(true);
    }
});

watch(isDark, () => {
    if (app) {
        initModel();
    }
});
</script>

<style scoped>
.live2d-container {
    width: 100%;
    height: 800px;
    border-radius: 8px;
    border: 1px dashed var(--vp-c-divider);
    cursor: grab;
}
.live2d-container:active {
    cursor: grabbing;
}
</style>