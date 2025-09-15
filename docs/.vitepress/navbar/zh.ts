import { DefaultTheme } from 'vitepress';
import { NavbarConstants } from '../utils/constants';
import { generateNavbar } from '../utils/navbar-generator';

// 中文导航栏配置
export const zhNavbar: DefaultTheme.Config['nav'] = [
    // 导航栏（首页）
    { text: NavbarConstants.HomeText, link: NavbarConstants.Home },

    // 导航栏（导航）
    generateNavbar(NavbarConstants.Navigation),

    // 导航栏（Live2D）
    generateNavbar(NavbarConstants.Live2D),

    // 导航栏（后端）
    generateNavbar(NavbarConstants.Backend),

    // 导航栏（DevOps）
    generateNavbar(NavbarConstants.DevOps),

    // 导航栏（常用工具）
    generateNavbar(NavbarConstants.Tools),
    
    // 导航栏（关于我）
    generateNavbar(NavbarConstants.About)
]