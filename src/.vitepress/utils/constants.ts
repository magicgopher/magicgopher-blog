// GitHub相关常量配置
export const GitHubConfigConstants = {
    // 项目名称
    ProjectName: "MagicGopher-Blog",
    // GitHub用户名
    UserName: "MagicGopher"
}

// 公共常量定义
export const publicConstants = {
    // map形式，
    About: '/docs/zh/关于我/'
}

// 自定义顶级导航栏文本和下拉列表内容映射
export const CustomTextMap: Record<string, string> = {
    // 将导航栏和侧边栏的英文文本内容映射为对应中文文本内容
    // 导航栏（编程语言）
    '01-go语言': 'Go语言',
    '01-前端基础': '前端基础',
    'devops': 'DevOps',
    'docker': 'Docker'
}

// 特殊的导航栏处理数组常量，
export const SpecialItems: string[] = [
    // 例如：某个目录下只有一个index.md，这里就需要配置，当导航栏点击时，跳转到该目录下的index.md
    // 示例：About: '/docs/zh/关于我/'，这里就是关于我目录下只有一个index.md
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
    // 导航栏（关于我）
    About: publicConstants.About
}

// 侧边栏常量枚举
export const SidebarConstants = {
    // Go语言侧边栏
    Golang: '/docs/zh/编程语言/01-Go语言/',
    // 前端基础侧边栏
    FrontendBase: '/docs/zh/前端技术/01-前端基础/',
    // Docker侧边栏
    Docker: '/docs/zh/DevOps/Docker/'
}

// 侧边栏不显示的文件常量
export const SidebarBlacklist: string[] = [
    // index.md文件在侧边栏不显示
    'index.md',
];