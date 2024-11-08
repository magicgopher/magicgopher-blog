// GitHub相关常量配置
export const GitHubConfigConstants = {
    // 项目名称
    ProjectName: "MagicGopher-Blog",
    // GitHub用户名
    UserName: "MagicGopher",
}

// 自定义顶级导航栏文本和下拉列表内容映射
export const CustomTextMap: Record<string, string> = {
    // 将导航栏和侧边栏的英文文本内容映射为对应中文文本内容
    // 导航栏（编程语言）
    '01-go': 'Go',
    '02-java': 'Java',
    // 导航栏（前端技术）
    '01-前端基础': '前端基础',
    // 导航栏（DevOps）
    'devops': 'DevOps',
    '01-docker': 'Docker',
    '02-kubernetes': 'Kubernetes',
}

// 特殊的导航栏处理数组常量，
export const SpecialItems: string[] = [
    // 例如 /docs/zh/常用工具/ 这样就导航栏的常用工具就不会显示下拉框了
    '/docs/zh/常用工具/',
]

// 导航栏常量枚举
export const NavbarConstants = {
    // 首页
    Home: '/',
    // 导航栏（编程语言）
    Program: '/docs/zh/编程语言/',
    // 导航栏（前端技术）
    Frontend: '/docs/zh/前端技术/',
    // 导航栏（DevOps）
    DevOps: '/docs/zh/DevOps/',
    // 导航栏（常用工具）
    Tools: '/docs/zh/常用工具/',
    // 导航栏（关于我）
    About: '/docs/zh/关于我/',
}

// 侧边栏常量枚举
export const SidebarConstants = {
    // Go语言侧边栏
    Golang: '/docs/zh/编程语言/01-Go/',
    // Java侧边栏
    Java: '/docs/zh/编程语言/02-Java/',
    // 前端基础侧边栏
    FrontendBase: '/docs/zh/前端技术/01-前端基础/',
    // Docker侧边栏
    Docker: '/docs/zh/DevOps/01-Docker/',
    // 常用工具侧边栏
    Tools: '/docs/zh/常用工具/',
}

// 侧边栏不显示的文件常量
export const SidebarBlacklist: string[] = [
    // index.md文件在侧边栏不显示
    'index.md',
];

// 要插入 <BackTop /> 组件的路径数组
export const specificPaths = [
    // 格式：'/src/docs/zh/编程语言/'
    '/src/docs/zh/编程语言/',
    '/src/docs/zh/前端技术/',
    '/src/docs/zh/DevOps/',
    '/src/docs/zh/常用工具/',
    '/src/docs/zh/关于我/',
];

// 不需要插入 <BackTop /> 组件的文件路径黑名单
export const blacklistPaths: string[] = [
    // 格式：'docs/zh/program/go/01-Go语言基础/08-字符串处理.md'
    // 'docs/zh/program/go/01-Go语言基础/08-字符串处理.md'
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