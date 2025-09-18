import { DefaultTheme } from 'vitepress';
import { NAVBAR_CONSTANTS } from '../utils/constants';
import { generateNavbar } from '../utils/navbar-generator';

// 中文导航栏配置
export const zhNavbar: DefaultTheme.Config['nav'] = [
    // 导航栏（首页）
    { text: NAVBAR_CONSTANTS.HomeText, link: NAVBAR_CONSTANTS.Home },

    // 导航栏（导航）
    generateNavbar(NAVBAR_CONSTANTS.Navigation),

    // 导航栏（Live2D）
    generateNavbar(NAVBAR_CONSTANTS.Live2D),

    // 导航栏（后端）
    generateNavbar(NAVBAR_CONSTANTS.Backend),

    // 导航栏（DevOps）
    generateNavbar(NAVBAR_CONSTANTS.DevOps),

    // 导航栏（常用工具）
    generateNavbar(NAVBAR_CONSTANTS.Tools),
    
    // 导航栏（关于我）
    generateNavbar(NAVBAR_CONSTANTS.About)
]