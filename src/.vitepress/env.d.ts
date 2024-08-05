// 原来的*.vue模块声明
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// busuanzi 统计模块声明
declare module 'busuanzi.pure.js' {
    export interface BusuanziData {
        site_pv: number;
        site_uv: number;
    }
    export function fetch(): Promise<BusuanziData>;
}