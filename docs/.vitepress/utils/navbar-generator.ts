import * as fs from 'fs';
import * as path from 'path';
import { CustomTextMap, SpecialItems } from './constants';

// 定义导航栏子条目接口
interface NavbarItem {
    text: string; // 显示的文本
    link: string; // 链接地址
}

// 定义导航栏接口
interface Navbar {
    text: string; // 导航栏标题
    link?: string; // 导航栏自身的链接（可选）
    items: NavbarItem[]; // 子条目数组
}

// 符号映射表，用于为目录或文件添加前缀符号
const SymbolMap: { [key: string]: string } = {
    '导航': '🧭',
    '后端': '🖥️',
    'DevOps': '🚀',
    '常用工具': '⚙️',
    '关于我': '👤',
};

/**
 * 生成 VitePress 导航栏数据结构
 * 根据指定的顶级目录，扫描其子目录和 Markdown 文件，生成导航栏配置
 *
 * @param topLevelDirectory 顶级目录路径
 * @returns 导航栏数据结构
 */
export function generateNavbar(topLevelDirectory: string): Navbar {
    // 构造顶级目录的完整路径
    const basePath = path.join(__dirname, '..', '..', topLevelDirectory);
    let items: string[] = [];

    // 读取顶级目录下的所有文件和子目录
    try {
        items = fs.readdirSync(basePath);
    } catch (error) {
        console.error(`读取目录 ${basePath} 失败:`, error);
        return { text: '', items: [] }; // 返回空导航栏以防止程序崩溃
    }

    // 过滤出所有子目录
    const directories = items.filter(item => {
        try {
            return fs.lstatSync(path.join(basePath, item)).isDirectory();
        } catch (error) {
            console.error(`读取 ${basePath} 中的项目 ${item} 失败:`, error);
            return false; // 忽略无法访问的项目
        }
    });

    // 过滤出所有 Markdown 文件（以 .md 结尾且不是目录）
    const markdownFiles = items.filter(item => {
        return item.endsWith('.md') && !fs.lstatSync(path.join(basePath, item)).isDirectory();
    });

    // 构建导航栏对象
    const navbar: Navbar = {
        text: getCustomText(topLevelDirectory), // 设置导航栏标题
        items: directories.map(subdirectory => {
            const subdirectoryPath = path.join(topLevelDirectory, subdirectory);
            return {
                text: getCustomText(subdirectory), // 子目录的显示文本
                link: `${subdirectoryPath}/` // 子目录链接（以 / 结尾）
            };
        })
    };

    // 添加 Markdown 文件作为导航栏子条目
    markdownFiles.forEach(file => {
        const filePath = path.join(topLevelDirectory, file);
        navbar.items.push({
            text: getCustomText(file), // 文件的显示文本
            link: `${filePath}` // 文件链接
        });
    });

    // 如果顶级目录在特殊条目列表中，设置导航栏自身的链接
    if (SpecialItems.includes(topLevelDirectory)) {
        navbar.link = `${topLevelDirectory}`;
    }

    // 返回生成的导航栏数据结构
    return navbar;
}

/**
 * 获取目录或文件的自定义显示文本
 * 如果在 CustomTextMap 中定义了映射，则返回映射值；否则返回原始名称
 * 为顶级目录、子目录或文件添加前缀符号（如果在 SymbolMap 中定义）
 *
 * @param directoryOrFile 目录或文件名
 * @returns 自定义显示文本
 */
function getCustomText(directoryOrFile: string): string {
    const name = path.basename(directoryOrFile, path.extname(directoryOrFile)).toLowerCase();
    const displayText = CustomTextMap[name] || name;
    // 为顶级目录、子目录或文件添加符号（如果在 SymbolMap 中定义）
    const symbol = SymbolMap[displayText];
    return symbol ? `${symbol}${displayText}` : displayText;
}