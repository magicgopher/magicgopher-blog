import { DefaultTheme } from 'vitepress';
import { NavbarConstants } from '../utils/constants';
import { generateNavbar } from '../utils/navbar-generate';

// 中文导航栏配置
export const zhNavbar: DefaultTheme.Config['nav'] = [
    // 导航栏（首页）
    { text: '首页', link: NavbarConstants.Home },
    // 导航栏（编程语言）
    generateNavbar(NavbarConstants.Program),
    // 导航栏（前端技术）
    generateNavbar(NavbarConstants.Frontend),
    // 导航栏（DevOps）
    generateNavbar(NavbarConstants.DevOps),
    // 导航栏（关于我）
    generateNavbar(NavbarConstants.About)
]