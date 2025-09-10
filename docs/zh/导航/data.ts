import type { NavData } from '../../.vitepress/utils/types';

export const NAV_DATA: NavData[] = [
    {
        title: '🎯 AI',
        items: [
            {
                icon: '/images/nav/gemini/gemini.svg',
                title: 'Gemini',
                desc: 'Gemini 是由 Google 开发的生成式人工智能',
                link: 'https://gemini.google.com'
            },
            {
                icon: {
                    light: '/images/nav/grok/grok-light.svg',
                    dark: '/images/nav/grok/grok-dark.svg'
                },
                title: 'Grok',
                desc: 'Grok 是 xAI 基于大型语言模型开发的生成式人工智能',
                link: 'https://grok.com'
            },
            {
                icon: {
                    light: '/images/nav/chatgpt/chatgpt-light.png',
                    dark: '/images/nav/chatgpt/chatgpt-dark.png'
                },
                title: 'ChatGPT',
                desc: '由 OpenAI 基于GPT（生成式预训练转换器）语言模型开发的人工智能',
                link: 'https://chatgpt.com'
            },
            {
                icon: '/images/nav/claude/claude.svg',
                title: 'Claude',
                desc: '由 Anthropic 打造的高性能、可信赖且智能的 AI 平台',
                link: 'https://claude.ai'
            },
            {
                icon: {
                    light: '/images/nav/midjourney/midjourney-light.png',
                    dark: '/images/nav/midjourney/midjourney-dark.png'
                },
                title: 'Midjourney',
                desc: '一款AI绘画工具',
                link: 'https://www.midjourney.com'
            },
            {
                icon: '/images/nav/suno/suno.png',
                title: 'Suno AI',
                desc: '一款生成式人工智能音乐创作工具',
                link: 'https://suno.com'
            },
            {
                icon: '/images/nav/deepseek/deepseek.png',
                title: 'DeepSeek',
                desc: '专注于研究世界领先的通用人工智能底层模型与技术',
                link: 'https://www.deepseek.com'
            }
        ]
    },
    {
        title: '🎯 大模型',
        items: [
            {
                icon: {
                    light: '/images/nav/ollama/ollama-light.png',
                    dark: '/images/nav/ollama/ollama-dark.png'
                },
                title: 'Ollama',
                desc: '专为在本地机器上便捷部署和运行大型语言模型（LLM）而设计',
                link: 'https://ollama.com'
            },
            {
                icon: '/images/nav/vllm/vllm.png',
                title: 'vLLM',
                desc: 'vLLM 是一个快速、易于使用的 LLM 推理和服务库',
                link: 'https://docs.vllm.ai'
            },
            {
                icon: '/images/nav/huggingface/huggingface.svg',
                title: 'Hugging Face',
                desc: '开源的机器学习平台，专注于自然语言处理（NLP）和人工智能（AI）',
                link: 'https://huggingface.co'
            },
            {
                icon: {
                    light: '/images/nav/mcp/mcp-light.png',
                    dark: '/images/nav/mcp/mcp-dark.png'
                },
                title: 'MCP',
                desc: 'MCP 是一个开放协议，它规范了应用程序向 LLM 提供上下文的方式',
                link: 'https://modelcontextprotocol.io'
            },
            {
                icon: '/images/nav/dify/dify.png',
                title: 'Dify',
                desc: 'Dify 是一个开源的 LLM 应用开发平台',
                link: 'https://dify.ai'
            },
            {
                icon: '/images/nav/n8n/n8n.png',
                title: 'n8n',
                desc: 'n8n 是一个工作流自动化平台',
                link: 'https://n8n.io'
            },
            {
                icon: '/images/nav/ragflow/ragflow.svg',
                title: 'RAGFlow',
                desc: 'RAGFlow 是一款基于深度文档理解的开源 RAG（检索增强生成）引擎',
                link: 'https://ragflow.io'
            },
            {
                icon: '/images/nav/anything-llm/anything-llm.svg',
                title: 'Anything LLM',
                desc: 'Anything LLM 是一个开源的 LLM 应用开发平台',
                link: 'https://anythingllm.com'
            }
        ]
    },
    {
        title: '🎯 Golang',
        items: [
            {
                icon: '/images/nav/cloudwego/cloudwego.png',
                title: 'CloudWeGo',
                desc: '字节跳动推出的一套开源中间件，可用于快速构建企业级云原生架构',
                link: 'https://www.cloudwego.io'
            },
            {
                icon: '/images/nav/kratos/go-kratos.svg',
                title: 'Kratos',
                desc: 'Kratos 是一个基于 Golang 实现的轻量级微服务框架',
                link: 'https://go-kratos.dev'
            },
            {
                icon: '/images/nav/go-zero/go-zero.svg',
                title: 'go-zero',
                desc: 'go-zero 是一个内置大量工程实践的 Web 和 RPC 框架',
                link: 'https://go-zero.dev'
            },
            {
                icon: '/images/nav/goproxy/goproxy.svg',
                title: 'Goproxy',
                desc: '目前中国最可靠的 Go 模块代理',
                link: 'https://goproxy.cn'
            },
            {
                icon: {
                    light: '/images/nav/go-fiber/fiber-light.svg',
                    dark: '/images/nav/go-fiber/fiber-dark.svg'
                },
                title: 'Fiber',
                desc: 'Fiber 是一个基于 Fasthttp（Go 中最快的 HTTP 引擎）构建的 Go Web 框架',
                link: 'https://gofiber.io'
            },
            {
                icon: '/images/nav/ent/ent.png',
                title: 'ent',
                desc: 'ent 是一款 Facebook 开源的go语言ORM框架',
                link: 'https://entgo.io'
            },
            {
                icon: '/images/nav/gorm/gorm.svg',
                title: 'GORM',
                desc: 'GORM 是一个简单、强大的 Go 语言数据库ORM框架',
                link: 'https://gorm.io'
            }
        ]
    },
    {
        title: '🎯 Java',
        items: [
            {
                icon: '/images/nav/spring/spring.svg',
                title: 'Spring',
                desc: '世界上最受欢迎的 Java 框架生态',
                link: 'https://spring.io'
            },
            {
                icon: '/images/nav/vertx/vertx.png',
                title: 'Vert.x™',
                desc: '基于 JVM 的开源、异步、事件驱动的应用程序框架',
                link: 'https://vertx.io'
            },
            {
                icon: '/images/nav/jhipster/jhipster.png',
                title: 'JHipster',
                desc: 'JHipster 是一个开发平台，用于快速生成、开发和部署现代 Web 应用程序和微服务架构',
                link: 'https://www.jhipster.tech'
            },
            {
                icon: '/images/nav/quarkus/quarkus.png',
                title: 'Quarkus',
                desc: '一个为Java 虚拟机（JVM）和原生编译而设计的全堆栈Kubernetes 原生Java 框架',
                link: 'https://quarkus.io'
            },
            {
                icon: {
                    light: '/images/nav/gradle/gradle-light.svg',
                    dark: '/images/nav/gradle/gradle-dark.svg'
                },
                title: 'Gradle',
                desc: 'Java、Android 和 Kotlin 开发者的首选开源构建系统',
                link: 'https://gradle.org'
            },
            {
                icon: '/images/nav/dubbo/dubbo.png',
                title: 'Apache Dubbo',
                desc: '构建具备内置 RPC、流量管控、安全、可观测能力的应用，支持Kubernetes和VM部署环境',
                link: 'https://dubbo.apache.org'
            },
            {
                icon: '/images/nav/nacos/nacos.png',
                title: 'Nacos',
                desc: '一个更容易构建云原生应用的动态服务发现、配置管理和服务管理平台',
                link: 'https://nacos.io'
            },
            {
                icon: '/images/nav/sentinel/sentinel.svg',
                title: 'Sentinel',
                desc: '一款开源的分布式系统的实时监控和自动化故障恢复工具',
                link: 'https://nacos.io'
            },
            {
                icon: '/images/nav/polaris/polaris.svg',
                title: 'Polaris',
                desc: 'Polaris是腾讯开源的一款一体化服务治理平台',
                link: 'https://polarismesh.cn'
            },
            {
                icon: '/images/nav/flowable/flowable.png',
                title: 'Flowable',
                desc: 'Flowable是一个使用Java编写的轻量级业务流程引擎',
                link: 'https://github.com/flowable/flowable-engine'
            },
            {
                icon: '/images/nav/mybatis/mybatis.svg',
                title: 'MyBatis',
                desc: 'MyBatis是一个Java持久化框架',
                link: 'https://mybatis.org/mybatis-3/'
            },
            {
                icon: '/images/nav/mybatis/mybatis-plus.svg',
                title: 'MyBatis Plus',
                desc: 'MyBatis-Plus是MyBatis的增强工具',
                link: 'https://baomidou.com'
            },
            {
                icon: '/images/nav/seata/seata.png',
                title: 'Seata',
                desc: 'Seata 是一款开源的分布式事务解决方案',
                link: 'https://seata.apache.org'
            },
            {
                icon: '/images/nav/langchain/langchain4j.svg',
                title: 'LangChain4j',
                desc: 'LangChain4j是一个为Java开发者设计的AI开源框架',
                link: 'https://docs.langchain4j.dev'
            }
        ]
    },
    {
        title: '🎯 大数据',
        items: [
            {
                icon: '/images/nav/hadoop/hadoop.svg',
                title: 'Hadoop',
                desc: 'Hadoop 是一个开源的、分布式的、可伸缩的大数据框架',
                link: 'https://hadoop.apache.org'
            },
            {
                icon: '/images/nav/spark/spark.svg',
                title: 'Apache Spark',
                desc: 'Apache Spark 是一个开源的分布式计算框架',
                link: 'https://spark.apache.org'
            },
            {
                icon: '/images/nav/elastic/elasticsearch.svg',
                title: 'Elasticsearch',
                desc: 'Elasticsearch 是一个开源的分布式搜索和分析引擎',
                link: 'https://www.elastic.co'
            },
            {
                icon: '/images/nav/elastic/kibana.svg',
                title: 'Kibana',
                desc: 'Kibana 是一个用于可视化 Elasticsearch 数据的开源工具',
                link: 'https://www.elastic.co'
            },
            {
                icon: '/images/nav/elastic/logstash.svg',
                title: 'Logstash',
                desc: 'Logstash 是一个开源的数据收集、聚合和传输工具',
                link: 'https://www.elastic.co'
            },
        ]
    },
    {
        title: '🎯 React生态',
        items: [
            {
                icon: '/images/nav/react/react.svg',
                title: 'React',
                desc: '用于构建 Web 和原生交互界面的 JavaScript 库',
                link: 'https://react.dev'
            },
            {
                icon: '/images/nav/react/react-router.svg',
                title: 'React Router',
                desc: 'React 路由解决方案',
                link: 'https://reactrouter.com'
            },
            {
                icon: '/images/nav/umijs/umijs.png',
                title: 'UmiJS',
                desc: 'Umi，中文发音为「乌米」，是可扩展的企业级前端应用框架',
                link: 'https://umijs.org'
            },
            {
                icon: '/images/nav/antd/antd.svg',
                title: 'Ant Design',
                desc: 'Ant Design - 一套企业级UI 设计语言和React 组件库',
                link: 'https://ant.design'
            },
            {
                icon: '/images/nav/tremor/tremor.ico',
                title: 'Tremor',
                desc: '一个开源的React组件库，专为构建数据驱动的Web应用（特别是仪表盘）而设计',
                link: 'https://tremor.so'
            }
        ]
    },
    {
        title: '🎯 Vue生态',
        items: [
            {
                icon: '/images/nav/vue/vue.svg',
                title: 'Vue 3',
                desc: '渐进式 JavaScript 框架，用于构建用户界面',
                link: 'https://vuejs.org'
            },
            {
                icon: '/images/nav/vue/vue.svg',
                title: 'Vue 2',
                desc: '渐进式 JavaScript 框架，用于构建用户界面',
                link: 'https://v2.vuejs.org'
            },
            {
                icon: '/images/nav/vue/vue-router.svg',
                title: 'Vue Router',
                desc: 'Vue Router 是 Vue.js 官方的客户端路由解决方案',
                link: 'https://router.vuejs.org'
            },
            {
                icon: '/images/nav/vue/vue3op.png',
                title: 'Vue3 One Piece',
                desc: 'Vue3 One Piece一个深入学习vue的神奇网站',
                link: 'https://vue3js.cn'
            },
            {
                icon: '/images/nav/pinia/pinia.svg',
                title: 'Pinia',
                desc: 'Pinia 是 Vue 3 的状态管理库',
                link: 'https://vue3js.cn'
            },
            {
                icon: '/images/nav/nuxt/nuxtjs.svg',
                title: 'Nuxt.js',
                desc: '一个基于Vue.js 的通用应用框架',
                link: 'https://nuxt.com'
            },
            {
                icon: '/images/nav/vant/vant.png',
                title: 'Vant',
                desc: '轻量、可定制的移动端 Vue 组件库',
                link: 'https://vant-ui.github.io'
            }
        ]
    },
    {
        title: '🎯 容器技术',
        items: [
            {
                icon: '/images/nav/podman/podman.webp',
                title: 'Podman',
                desc: 'Red Hat公司所推出的一款符合开放源代码容器倡议的开放源代码容器管理工具',
                link: 'https://podman.io'
            },
            {
                icon: '/images/nav/podman/podman-desktop.svg',
                title: 'Podman Desktop',
                desc: '开发者使用容器和 Kubernetes 的最佳免费开源工具',
                link: 'https://podman-desktop.io'
            },
            {
                icon: '/images/nav/docker/docker.png',
                title: 'Docker Desktop',
                desc: 'Docker Desktop是Docker的一个官方桌面应用程序',
                link: 'https://www.docker.com'
            },
            {
                icon: '/images/nav/kubernetes/kubernetes.png',
                title: 'Kubernetes',
                desc: '一个开源容器编排系统',
                link: 'https://kubernetes.io'
            },
            {
                icon: '/images/nav/colima/colima.png',
                title: 'Colima',
                desc: 'Colima是一种为macOS和Linux设计的开源容器运行时工具',
                link: 'https://github.com/abiosoft/colima'
            }
        ]
    },
    {
        title: '🎯 社区',
        items: [
            {
                icon: {
                    light: '/images/nav/github/github-light.svg',
                    dark: '/images/nav/github/github-dark.svg'
                },
                title: 'GitHub',
                desc: '全球最大的代码托管平台',
                link: 'https://github.com'
            },
            {
                icon: '/images/nav/stack-overflow/stackoverflow.svg',
                title: 'Stack Overflow',
                desc: '全球最大的技术问答社区',
                link: 'https://stackoverflow.com'
            },
            {
                icon: '/images/nav/leetcode/leetcode.svg',
                title: 'LeetCode',
                desc: '提供用户练习编码和算法练习的在线平台',
                link: 'https://leetcode.com'
            }
        ]
    },
    {
        title: '🎯 工具',
        items: [
            {
                icon: '/images/nav/mirrors/mirrors.png',
                title: '镜像站',
                desc: 'Docker镜像站 && GitHub镜像站',
                link: 'https://mirror.kentxxq.com'
            },
            {
                icon: '/images/nav/pingcap/pingcode.png',
                title: 'PingCode',
                desc: 'PingCode 是简单易用的新一代研发管理平台',
                link: 'https://pingcode.com'
            },
            {
                icon: '/images/nav/nus/nus.png',
                title: 'Visualgo',
                desc: '由新加坡国立大学开发的可视化网站',
                link: 'https://visualgo.net'
            },
            {
                icon: '/images/nav/hoppscotch/hoppscotch.png',
                title: 'Hoppscotch',
                desc: 'Hoppscotch是一个开源的API测试工具',
                link: 'https://hoppscotch.io'
            }
        ]
    },
    {
        title: '🎯 数据库',
        items: [
            {
                icon: '/images/nav/postgresql/postgresql.svg',
                title: 'PostgreSQL',
                desc: 'PostgreSQL 是一个开源的关系数据库管理系统',
                link: 'https://www.postgresql.org'
            },
            {
                icon: '/images/nav/mysql/mysql.svg',
                title: 'MySQL',
                desc: 'MySQL 是一个开源的关系数据库管理系统',
                link: 'https://www.mysql.com'
            },
            {
                icon: '/images/nav/redis/redis.svg',
                title: 'Redis',
                desc: 'Redis 是一个开源的内存数据库系统',
                link: 'https://redis.io'
            },
            {
                icon: '/images/nav/mongodb/mongodb.svg',
                title: 'MongoDB',
                desc: 'MongoDB 是一个开源的文档数据库管理系统',
                link: 'https://www.mongodb.com'
            },
            {
                icon: '/images/nav/pingcap/tidb.svg',
                title: 'TiDB',
                desc: 'TiDB 是一个开源的分布式关系数据库系统',
                link: 'https://www.pingcap.com'
            }
        ]
    }
]