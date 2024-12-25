import * as fs from 'fs';
import * as path from 'path';
import { CustomTextMap, SpecialItems } from './constants';

// 导航栏生成器，根据路径生成导航栏

// 定义导航栏子项
interface NavbarItem {
    text: string;
    link: string;
}

// 导航栏
interface Navbar {
    text: string;
    link?: string;
    items: NavbarItem[];
}

// 根据目录的路径生成导航栏
export function generateNavbar(topLevelDirectory: string): Navbar {
    const basePath = path.join(__dirname, '..', '..', topLevelDirectory);
    let items: string[] = [];
    try {
        items = fs.readdirSync(basePath);
    } catch (error) {
        console.error(`Error reading directory ${basePath}:`, error);
        return { text: '', items: [] };
    }
    // 过滤出子目录和 Markdown 文件
    const directories = items.filter(item => {
        try {
            return fs.lstatSync(path.join(basePath, item)).isDirectory();
        } catch (error) {
            console.error(`Error reading item ${item} in ${basePath}:`, error);
            return false;
        }
    });
    // 过滤出 Markdown 文件
    const markdownFiles = items.filter(item => {
        return item.endsWith('.md') && !fs.lstatSync(path.join(basePath, item)).isDirectory();
    });
    // 生成导航栏数据结构
    const navbar: Navbar = {
        text: getCustomText(topLevelDirectory),
        items: directories.map(subdirectory => {
            const subdirectoryPath = path.join(topLevelDirectory, subdirectory);
            return {
                text: getCustomText(subdirectory),
                link: `${subdirectoryPath}/`
            };
        })
    };
    // 处理目录下的 Markdown 文件
    markdownFiles.forEach(file => {
        const filePath = path.join(topLevelDirectory, file);
        navbar.items.push({
            text: getCustomText(file),
            link: `${filePath}`
        });
    });
    // 处理特殊的导航栏处理数组
    if (SpecialItems.includes(topLevelDirectory)) {
        navbar.link = `${topLevelDirectory}`;
    }
    return navbar;
}

// 获取自定义文本
function getCustomText(directoryOrFile: string): string {
    const name = path.basename(directoryOrFile, path.extname(directoryOrFile)).toLowerCase();
    return CustomTextMap[name] || name;
}