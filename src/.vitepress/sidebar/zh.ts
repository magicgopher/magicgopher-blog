import { DefaultTheme } from 'vitepress';
import { SidebarConstants } from '../utils/constants';
import { generateSidebar } from '../utils/sidebar-generate';

// 中文侧边栏配置
export const zhSidebar: DefaultTheme.Config['sidebar'] = {
    // 侧边栏 编程语言导航栏 （Go语言）
    [SidebarConstants.Golang]: generateSidebar(SidebarConstants.Golang),
    [SidebarConstants.Java]: generateSidebar(SidebarConstants.Java),
    // 侧边栏 前端技术导航栏（前端基础）
    [SidebarConstants.FrontendBase]: generateSidebar(SidebarConstants.FrontendBase),
    // 侧边栏 DevOps（Docker）
    [SidebarConstants.Docker]: generateSidebar(SidebarConstants.Docker),
    // 侧边栏 DevOps（Kubernetes）
    [SidebarConstants.Kubernetes]: generateSidebar(SidebarConstants.Kubernetes),
    // 侧边栏 常用工具
    [SidebarConstants.Tools]: generateSidebar(SidebarConstants.Tools),
}