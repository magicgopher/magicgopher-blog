// busuanzi 统计模块声明
// declare module 'busuanzi.pure.js' {
//     export interface BusuanziData {
//         site_pv: number;
//         site_uv: number;
//     }
//     export function fetch(): Promise<BusuanziData>;
// }

// busuanzi 统计模块声明
declare module "busuanzi.pure.js" {
    const busuanzi: any;
    export default busuanzi;
}