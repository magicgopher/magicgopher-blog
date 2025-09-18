import * as fs from 'fs';
import * as path from 'path';
import { SIDEBAR_BLACK_LIST } from './constants';

// 定义侧边栏条目接口
interface SidebarItem {
    text: string; // 显示文本
    collapsed: boolean; // 是否默认折叠
    link?: string; // 链接地址（仅对文件有效，可选）
    items: SidebarItem[]; // 子条目数组，用于嵌套目录
}

/**
 * 生成 VitePress 侧边栏数据结构
 * 递归扫描指定目录下的子目录和 Markdown 文件，生成侧边栏配置
 *
 * @param baseDir 基础目录路径
 * @returns 侧边栏条目数组
 */
export function generateSidebar(baseDir: string): SidebarItem[] {
    const sidebar: SidebarItem[] = []; // 存储生成的侧边栏条目
    const dirPath = path.join(__dirname, '..', '..', baseDir); // 构造完整目录路径
    const files = fs.readdirSync(dirPath); // 读取目录内容
    files.sort(compareFileNames); // 按自定义规则排序文件和子目录
    const addedItems: { [key: string]: SidebarItem } = {}; // 跟踪已添加的 Markdown 文件条目

    // 遍历目录内容
    files.forEach((file) => {
        // 忽略黑名单中的文件（如 index.md）
        if (SIDEBAR_BLACK_LIST.includes(file.toLowerCase())) {
            return;
        }

        const filePath = path.join(dirPath, file); // 构造文件/子目录的完整路径
        const stat = fs.statSync(filePath); // 获取文件/目录状态

        // 处理子目录
        if (stat.isDirectory()) {
            const subDirSidebarItems = generateSidebar(path.join(baseDir, file)); // 递归生成子目录侧边栏
            if (subDirSidebarItems.length > 0) { // 仅添加非空的子目录
                const directoryItem: SidebarItem = {
                    text: extractDirectoryName(file), // 提取目录显示名称
                    collapsed: true, // 默认折叠
                    link: '', // 目录通常无直接链接
                    items: subDirSidebarItems, // 子目录的侧边栏条目
                };
                sidebar.push(directoryItem); // 添加到侧边栏
            }
        }
        // 处理 Markdown 文件
        else if (file.endsWith('.md')) {
            const subFilePath = path.join(baseDir, file); // 构造文件相对路径
            const text = extractTextFromFileName(file); // 提取文件显示名称
            const sidebarItem: SidebarItem = {
                text, // 文件显示名称
                collapsed: true, // 默认折叠（文件通常无子条目）
                link: `${subFilePath.slice(0, -3)}`, // 文件链接，去掉 .md 后缀
                items: [], // 文件无子条目
            };
            sidebar.push(sidebarItem); // 添加到侧边栏
            addedItems[text] = sidebarItem; // 记录已添加条目
        }
    });

    return sidebar; // 返回生成的侧边栏
}

/**
 * 从文件名提取侧边栏显示文本
 * 将形如 01-markdown.md 的文件名转换为 01.markdown
 *
 * @param fileName 文件名
 * @returns 格式化后的显示文本
 */
function extractTextFromFileName(fileName: string): string {
    const match = fileName.match(/^(\d+)[-._+]?\s*(.*)\.md$/); // 匹配数字前缀和主体
    if (match && match[1] && match[2]) {
        const number = parseInt(match[1], 10); // 提取数字
        return `${number}.${match[2]}`; // 返回格式化文本，如 01.markdown
    }
    return fileName.slice(0, -3); // 默认去掉 .md 后缀
}

/**
 * 从目录名提取侧边栏显示文本
 * 将形如 01-docs 的目录名转换为 docs
 *
 * @param dirName 目录名
 * @returns 格式化后的显示文本
 */
function extractDirectoryName(dirName: string): string {
    const match = dirName.match(/^\d+[-.]?\s*(.*)$/); // 匹配数字前缀和主体
    if (match && match[1]) {
        return match[1]; // 返回主体部分
    }
    return dirName; // 默认返回原始目录名
}

/**
 * 比较文件名以进行排序
 * 优先按数字前缀排序，若无数字前缀则按字母顺序排序
 *
 * @param fileNameA 第一个文件名
 * @param fileNameB 第二个文件名
 * @returns 比较结果（负数表示 fileNameA 排在前面）
 */
function compareFileNames(fileNameA: string, fileNameB: string): number {
    const [, numA] = fileNameA.match(/^(\d+)[-._+]?/) || []; // 提取数字前缀
    const [, numB] = fileNameB.match(/^(\d+)[-._+]?/) || []; // 提取数字前缀

    if (numA && numB) {
        return Number(numA) - Number(numB); // 按数字大小排序
    } else if (numA) {
        return -1; // 有数字前缀的排在前面
    } else if (numB) {
        return 1; // 有数字前缀的排在前面
    } else {
        return fileNameA.localeCompare(fileNameB); // 按字母顺序排序
    }
}