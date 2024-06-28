import Theme from 'vitepress/theme';
import BackTop from '../components/BackTop.vue';
import './style/index.scss';

export default {
    ...Theme,
    enhanceApp({ app }) {
        app.component('BackTop', BackTop);
    }
}