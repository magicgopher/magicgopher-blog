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
    About: '关于我'
}

// 特殊的导航栏处理数组常量，
export const SpecialItems: string[] = [
    // 例如：某个目录下只有一个index.md，这里就需要配置，当导航栏点击时，跳转到该目录下的index.md
    // 示例：About: '/docs/zh/关于我/'，这里就是关于我目录下只有一个index.md
]

// 导航栏常量枚举
export const NavbarConstants = {
    // 首页
    'Home': '/',
    // 关于我
    'About': publicConstants.About
}