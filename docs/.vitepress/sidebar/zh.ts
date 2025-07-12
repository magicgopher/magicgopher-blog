import { DefaultTheme } from 'vitepress';
import { SidebarConstants } from '../utils/constants';
import { generateSidebar } from '../utils/sidebar-generator';

// 中文侧边栏配置
export const zhSidebar: DefaultTheme.Config['sidebar'] = {
    // 侧边栏 后端（Golang）
    [SidebarConstants.Golang]: generateSidebar(SidebarConstants.Golang),

    // 侧边栏 后端（Java）
    [SidebarConstants.Java]: generateSidebar(SidebarConstants.Java),
    
    // 侧边栏 DevOps（Docker）
    [SidebarConstants.Docker]: generateSidebar(SidebarConstants.Docker),

    // 侧边栏 DevOps（Kubernetes）
    [SidebarConstants.Kubernetes]: generateSidebar(SidebarConstants.Kubernetes),
    
    // 侧边栏 常用工具
    [SidebarConstants.Tools]: generateSidebar(SidebarConstants.Tools),
}