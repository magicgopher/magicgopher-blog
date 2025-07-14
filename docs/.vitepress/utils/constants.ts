// GitHub相关常量配置
export const GitHubConfigConstants = {
    // 项目名称
    ProjectName: "magicgopher-blog",
    // GitHub用户名
    UserName: "magicgopher",
}

// 自定义顶级导航栏文本和下拉列表内容映射
export const CustomTextMap: Record<string, string> = {
    // 将导航栏和侧边栏的英文文本内容映射为对应中文文本内容
    // 导航栏（后端）
    '01-golang': 'Golang',
    '02-java': 'Java',
    // 导航栏（DevOps）
    'devops': 'DevOps',
    '01-docker': 'Docker',
    '02-kubernetes': 'Kubernetes',
}

// 特殊的导航栏处理数组常量，
export const SpecialItems: string[] = [
    // 例如 /zh/常用工具/ 这样就导航栏的常用工具就不会显示下拉框了
    '/zh/常用工具/',
    '/zh/导航/',
]

// 导航栏常量枚举
export const NavbarConstants = {
    // 首页
    Home: '/',
    Navigation: '/zh/导航/',
    // 导航栏（后端）
    Program: '/zh/后端/',
    // 导航栏（DevOps）
    DevOps: '/zh/DevOps/',
    // 导航栏（常用工具）
    Tools: '/zh/常用工具/',
    // 导航栏（关于我）
    About: '/zh/关于我/',
}

// 侧边栏常量枚举
export const SidebarConstants = {
    // 导航
    Navbar: '/zh/导航/',
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
export const SidebarBlacklist: string[] = [
    // index.md文件在侧边栏不显示
    'index.md',
];

// 要插入 <BackToTop /> 组件的路径数组
export const specificPaths = [
    // 格式：'/src/docs/zh/后端/'
    '/docs/zh/后端/',
    '/docs/zh/DevOps/',
    '/docs/zh/常用工具/',
    '/docs/zh/关于我/',
];

// 不需要插入 <BackToTop /> 组件的文件路径黑名单
export const blacklistPaths: string[] = [
    // 格式：'zh/后端/01-Golang/01-Golang基础/01-简介和发展历程.md'
];

// Live2D模型配置
export const live2dModels = [
    {
        path: '/live2d/abeikelongbi_3/abeikelongbi_3.model3.json',
        scale: 0.05,
        stageStyle: {
            height: 350
        }
    }
]