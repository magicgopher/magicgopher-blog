// docs/.vitepress/types/pixi.d.ts

declare module "pixi.js" {
    import * as PIXI from "pixi.js";
    export = PIXI;
}

declare module "pixi-live2d-display/cubism4" {
    import { Live2DModel } from "pixi-live2d-display/cubism4";
    export { Live2DModel };
}
