// pixi.js 模块声明，用于导入 PIXI.js 库的类型定义
declare module "pixi.js" {
    // 导入 PIXI.js 的所有导出内容
    import * as PIXI from "pixi.js";
    // 将 PIXI 作为默认导出
    export = PIXI;
}

// pixi-live2d-display/cubism4 模块声明，用于导入 Live2D Cubism 4 模型支持
declare module "pixi-live2d-display/cubism4" {
    // 导入 Live2DModel 类，用于渲染和操作 Live2D 模型
    import { Live2DModel } from "pixi-live2d-display/cubism4";
    // 导出 Live2DModel 类
    export { Live2DModel };
}

// Window 接口扩展，添加 Live2D 相关的全局属性
declare interface Window {
    // 存储 Live2D Cubism Core 脚本加载的 Promise
    cubismCoreLoaded: Promise<void>;
    // Live2D Cubism Core 的全局对象，用于核心功能支持
    Live2DCubismCore: any;
}