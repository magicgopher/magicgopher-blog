import * as fs from 'fs';
import * as path from 'path';
import { SidebarBlacklist } from './constants';

// 侧边栏生成器，根据路径生成侧边栏

// 侧边栏项接口
interface SidebarItem {
    // 显示的文本
    text: string;
    // 是否折叠
    collapsed: boolean;
    // 链接（可选）
    link?: string;
    // 子项列表
    items: SidebarItem[];
}

/**
 * 生成侧边栏
 * @param baseDir 基础目录
 * @returns 生成的侧边栏项数组
 */
export function generateSidebar(baseDir: string): SidebarItem[] {
    const sidebar: SidebarItem[] = [];
    // 获取目录路径
    const dirPath = path.join(__dirname, '..', '..', baseDir);
    // 读取目录下的文件列表
    const files = fs.readdirSync(dirPath);

    // 排序文件数组
    files.sort(compareFileNames);

    // 记录已经添加的侧边栏项目
    const addedItems: { [key: string]: SidebarItem } = {};

    // 构建侧边栏数据结构
    files.forEach((file) => {
        // 黑名单文档跳过不显示
        if (SidebarBlacklist.includes(file.toLowerCase())) {
            return;
        }
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        // 如果是目录，则递归处理
        if (stat.isDirectory()) {
            const subDirSidebarItems = generateSidebar(path.join(baseDir, file));
            if (subDirSidebarItems.length > 0) {
                const directoryItem: SidebarItem = {
                    text: extractDirectoryName(file),
                    collapsed: true,
                    link: '',
                    items: subDirSidebarItems,
                };
                sidebar.push(directoryItem);
            }
        } else if (file.endsWith('.md')) {
            // 如果当前文件是一个 Markdown 文件的处理逻辑
            const subFilePath = path.join(baseDir, file);
            const text = extractTextFromFileName(file);
            let sidebarItem = addedItems[text];
            sidebarItem = {
                text,
                collapsed: true,
                link: `${subFilePath.slice(0, -3)}`,
                items: [],
            };
            sidebar.push(sidebarItem);
            addedItems[text] = sidebarItem;
        }
    });
    return sidebar;
}

/**
 * 从文件名中提取文本并格式化
 * @param fileName 文件名
 * @returns 例如：01-markdown.md --> 01.markdown
 */
function extractTextFromFileName(fileName: string): string {
    // 匹配文件名中的数字和文本部分
    const match = fileName.match(/^(\d+)[-._+]?\s*(.*)\.md$/);
    if (match && match[1] && match[2]) {
        // match[1] 是数字部分，match[2] 是文本部分
        // 去掉数字前面的 0，然后加上 '.'
        const number = parseInt(match[1], 10);
        return `${number}.${match[2]}`;
    }
    return fileName.slice(0, -3);
}

/**
 * 从目录名中提取文本
 * @param dirName 目录名
 * @returns 提取的文本
 */
function extractDirectoryName(dirName: string): string {
    const match = dirName.match(/^\d+[-.]?\s*(.*)$/);
    if (match && match[1]) {
        return match[1];
    }
    return dirName;
}

/**
 * 比较文件名函数，用于排序文件数组
 * @param fileNameA 第一个文件名
 * @param fileNameB 第二个文件名
 * @returns 比较结果，负数表示 fileNameA 在 fileNameB 前，正数表示 fileNameA 在 fileNameB 后，零表示相等
 */
function compareFileNames(fileNameA: string, fileNameB: string): number {
    // 提取 fileNameA 中的数字部分
    const [, numA] = fileNameA.match(/^(\d+)[-._+]?/) || [];
    // 提取 fileNameB 中的数字部分
    const [, numB] = fileNameB.match(/^(\d+)[-._+]?/) || [];

    if (numA && numB) {
        // 如果两个文件名都有数字部分，则将数字部分转换为数字类型进行比较
        return Number(numA) - Number(numB);
    } else if (numA) {
        // 如果只有 fileNameA 有数字部分，则 fileNameA 较小，应排在 fileNameB 前面
        return -1;
    } else if (numB) {
        // 如果只有 fileNameB 有数字部分，则 fileNameB 较小，应排在 fileNameA 前面
        return 1;
    } else {
        // 如果两个文件名都没有数字部分，则按字母顺序比较
        return fileNameA.localeCompare(fileNameB);
    }
}