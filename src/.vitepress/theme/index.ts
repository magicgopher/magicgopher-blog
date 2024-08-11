import { h } from 'vue';
import { inBrowser } from 'vitepress';
import type { Theme } from 'vitepress';
import escookTheme from '@escook/vitepress-theme';
import BackTop from './components/BackTop.vue';
import VisitorStats from './components/VisitorStats.vue';
import GiscusComment from './components/GiscusComment.vue';
import busuanzi from 'busuanzi.pure.js';
import '@escook/vitepress-theme/style.css';
import './style/index.scss';

export default {
    extends: escookTheme,
    Layout: () => {
        return h(escookTheme.Layout, null, {
            // 添加评论
            'doc-after': () => h(GiscusComment),
        })
    },
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
} satisfies Theme