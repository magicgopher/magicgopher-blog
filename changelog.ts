const flag = true
const options = {
    writerOpts: {
        transform: (commit, context) => {
            // 添加这个条件来过滤掉特定的 commit
            if (commit.type === 'chore' && commit.subject.trim() === '生成博客更新日志。') {
                return false;
            }
            // let discard = true
            const issues = []

            // commit.notes.forEach(note => {
            //   note.title = "重大变化"
            //   discard = false
            // })

            // 提交类型
            if (commit.type === 'feat') {
                commit.type = '✨ Features | 新功能'
            } else if (commit.type === 'fix') {
                commit.type = '🐛 Bug Fixes | Bug 修复'
            } else if (commit.type === 'remove') {
                commit.type = '🗑️ Removal | 功能移除'
            } else if (commit.type === 'perf') {
                commit.type = '⚡ Performance Improvements | 性能优化'
            } else if (commit.type === 'revert' || commit.revert) {
                commit.type = '⏪ Reverts | 回退'
            } /* else if (discard) {
                return
            } */ else if (commit.type === 'docs') {
                commit.type = '📝 Documentation | 文档'
            } else if (commit.type === 'style') {
                commit.type = '💄 Styles | 风格'
            } else if (commit.type === 'refactor') {
                commit.type = '♻ Code Refactoring | 代码重构'
            } else if (commit.type === 'test') {
                commit.type = '✅ Tests | 测试'
            } else if (commit.type === 'build') {
                commit.type = '👷‍ Build System | 构建'
            } else if (commit.type === 'ci') {
                commit.type = '🔧 Continuous Integration | CI 配置'
            } else if (commit.type === 'chore') {
                commit.type = '⚙️ Chores | 其他更新'
            } else if (commit.type === 'deps') {
                commit.type = '📦 Dependencies | 依赖更新'
            } else if (commit.type === 'merge') {
                commit.type = '🔀 Merges | 合并'
            } else if (commit.type === 'release') {
                commit.type = '🚀 Releases | 发布'
            } else if (commit.type === 'wip') {
                commit.type = '🚧 Work in Progress | 进行中'
            }

            if (commit.scope === "*") {
                commit.scope = ""
            }

            if (typeof commit.hash === "string") {
                commit.shortHash = commit.hash.substring(0, 7)
            }

            if (typeof commit.subject === "string") {
                let url = context.repository
                    ? `${context.host}/${context.owner}/${context.repository}`
                    : context.repoUrl
                if (url) {
                    url = `${url}/issues/`
                    // Issue URLs.
                    commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
                        issues.push(issue)
                        return `[#${issue}](${url}${issue})`
                    })
                }
                if (context.host) {
                    // User URLs.
                    commit.subject = commit.subject.replace(
                        /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
                        (_, username) => {
                            if (username.includes("/")) {
                                return `@${username}`
                            }
                            return `[@${username}](${context.host}/${username})`
                        }
                    )
                }
            }

            commit.subject = `${commit.subject} <sub style="color: var(--vp-c-gray)"> ${commit.committerDate}</sub>`

            // remove references that already appear in the subject
            commit.references = commit.references.filter(reference => {
                if (issues.indexOf(reference.issue) === -1) {
                    return true
                }

                return false
            })

            // 提交时间
            commit.sortTime = context.sortTime = Date.now() - new Date(commit.committerDate).getDate()

            // 把版本设为 markdown 二级标题
            commit.gitTags && (commit.isPatch = true)

            context.version = "更新日志"
            context.date = ""

            return commit
        },
        groupBy: "type",
        commitGroupsSort: "committerDate",
        commitsSort: ["committerDate", "scope", "subject"],
        noteGroupsSort: "sortTime",
    },
}
module.exports = options