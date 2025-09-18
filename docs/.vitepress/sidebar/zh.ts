import { DefaultTheme } from 'vitepress';
import { SIDEBAR_CONSTANTS } from '../utils/constants';
import { generateSidebar } from '../utils/sidebar-generator';

// 中文侧边栏配置
export const zhSidebar: DefaultTheme.Config['sidebar'] = {

    // 侧边栏 Live2D
    [SIDEBAR_CONSTANTS.Live2D]: generateSidebar(SIDEBAR_CONSTANTS.Live2D),

    // 侧边栏 后端（Golang）
    [SIDEBAR_CONSTANTS.Golang]: generateSidebar(SIDEBAR_CONSTANTS.Golang),

    // 侧边栏 后端（Java）
    [SIDEBAR_CONSTANTS.Java]: generateSidebar(SIDEBAR_CONSTANTS.Java),
    
    // 侧边栏 DevOps（Docker）
    [SIDEBAR_CONSTANTS.Docker]: generateSidebar(SIDEBAR_CONSTANTS.Docker),

    // 侧边栏 DevOps（Kubernetes）
    [SIDEBAR_CONSTANTS.Kubernetes]: generateSidebar(SIDEBAR_CONSTANTS.Kubernetes),
    
    // 侧边栏 常用工具
    [SIDEBAR_CONSTANTS.Tools]: generateSidebar(SIDEBAR_CONSTANTS.Tools),
}