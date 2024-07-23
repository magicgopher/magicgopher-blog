import Theme from 'vitepress/theme';
import BackTop from '../components/BackTop.vue';
import VisitorStats from '../components/VisitorStats.vue'
import busuanzi from 'busuanzi.pure.js'
import { inBrowser } from 'vitepress'
import './style/index.scss';

export default {
    ...Theme,
    enhanceApp({ app, router }) {
        app.component('BackTop', BackTop);
        app.component('VisitorStats', VisitorStats);
        // 判断是否在浏览器环境
        if (inBrowser) {
            router.onAfterRouteChanged = () => {
                busuanzi.fetch()
            }
        }
    }
}