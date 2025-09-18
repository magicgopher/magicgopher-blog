// GitHub相关常量配置
export const GITHUB_CONFIG_CONSTANTS = {
    // 项目名称
    ProjectName: "magicgopher-blog",
    // GitHub用户名
    UserName: "magicgopher",
}

// 自定义顶级导航栏文本和下拉列表内容映射
export const CUSTOM_TEXT_MAP: Record<string, string> = {
    // 将导航栏和侧边栏的英文文本内容映射为对应中文文本内容
    // 导航栏（后端）
    '01-golang': 'Golang',
    '02-java': 'Java',
    // 导航栏（DevOps）
    'devops': 'DevOps',
    '01-docker': 'Docker',
    '02-kubernetes': 'Kubernetes',
    // 导航栏（Live2D）
    'live2d': 'Live2D',
    '01-碧蓝航线': '碧蓝航线'
}

// 特殊的导航栏处理数组常量，
export const SPECIAL_ITEMS: string[] = [
    // 例如 /zh/常用工具/ 这样就导航栏的常用工具就不会显示下拉框了
    '/zh/常用工具/',
    '/zh/导航/',
]

// 导航栏常量枚举
export const NAVBAR_CONSTANTS = {
    // 导航栏（首页）
    HomeText: '首页',
    Home: '/',
    // 导航栏（导航）
    Navigation: '/zh/导航/',
    // 导航栏（Live2D）
    Live2D: '/zh/Live2D/',
    // 导航栏（后端）
    Backend: '/zh/后端/',
    // 导航栏（DevOps）
    DevOps: '/zh/DevOps/',
    // 导航栏（常用工具）
    Tools: '/zh/常用工具/',
    // 导航栏（关于我）
    About: '/zh/关于我/',
}

// 侧边栏常量枚举
export const SIDEBAR_CONSTANTS = {
    // Live2D侧边栏（）
    Live2D: '/zh/Live2D/',
    // Golang侧边栏
    Golang: '/zh/后端/01-Golang/',
    // Java侧边栏
    Java: '/zh/后端/02-Java/',
    // Docker侧边栏
    Docker: '/zh/DevOps/01-Docker/',
    // Kubernetes侧边栏
    Kubernetes: '/zh/DevOps/02-Kubernetes/',
    // 常用工具侧边栏
    Tools: '/zh/常用工具/',
}

// 侧边栏不显示的文件常量
export const SIDEBAR_BLACK_LIST: string[] = [
    // index.md文件在侧边栏不显示
    'index.md',
];

// OhMyLive2D Live2D模型配置
export const LIVE2D_MODELS_PATH = [
    {
        path: '/live2d/abeikelongbi_3/abeikelongbi_3.model3.json',
        scale: 0.05,
        stageStyle: {
            height: 350
        }
    },
    {
        path: '/live2d/aijier_3/aijier_3.model3.json',
        scale: 0.05,
        stageStyle: {
            height: 450
        }
    },
    {
        path: '/live2d/baerdimo_6/baerdimo_6.model3.json',
        scale: 0.05,
        stageStyle: {
            height: 360
        }
    }
]

// 导航栏符号映射表，用于为目录或文件添加前缀符号
export const SYMBOL_MAP: { [key: string]: string } = {
    // '导航': '🧭',
    // '后端': '🖥️',
    // 'DevOps': '🚀',
    // '常用工具': '⚙️',
    // '关于我': '👤',
};

/**
 * @description 定义需要隐藏看板娘的路径列表
 * * some() 方法会遍历数组中的每个元素，并对每个元素执行一次提供的函数，直到找到一个使得函数返回 true 的元素。
 * 如果找到了这样的元素，some() 会立即返回 true。否则，some() 返回 false。
 * startsWith() 方法用于检查当前路由路径是否以数组中定义的任何一个路径为开头。
 * * @example
 * export const HIDE_LIVE2D_PATHS = ['/zh/Live2D/', '/zh/后端/', '/zh/前端/'];
 */
export const HIDE_LIVE2D_PATHS = [
    '/zh/Live2D/'
]

/**
 * @description 定义需要隐藏“<BackToTop>返回顶部”组件的路径列表
 * @example
 * export const HIDE_BACKTOTOP_PATHS = ['/zh/about/', '/zh/friends/'];
 */
export const HIDE_BACKTOTOP_PATHS = [
    '/zh/导航/'
]