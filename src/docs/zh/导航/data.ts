import type { NavData } from '../../../.vitepress/utils/types'

export const NAV_DATA: NavData[] = [
    {
        title: 'AI导航',
        items: [
            {
                icon: '/images/nav/gemini.png',
                title: 'Gemini',
                desc: '由 Google DeepMind 开发的多模态大型语言模型(LLM)系列',
                link: 'https://gemini.google.com'
            },
            {
                icon: '/images/nav/grok.png',
                title: 'Grok',
                desc: '由Elon Musk旗下的xAI公司推出的Grok AI，作为一款全新的生成式人工智能助手',
                link: 'https://grok.com'
            },
            {
                icon: '/images/nav/chatgpt.png',
                title: 'ChatGPT',
                desc: '由 OpenAI 基于GPT（生成式预训练转换器）语言模型开发的人工智能聊天机器人',
                link: 'https://chatgpt.com'
            },
            {
                icon: '/images/nav/claude.png',
                title: 'Claude',
                desc: '由 Anthropic 打造的高性能、可信赖且智能的 AI 平台',
                link: 'https://claude.ai'
            }
        ]
    },
    {
        title: '大模型',
        items: [
            {
                icon: '/images/nav/ollama.png',
                title: 'Ollama',
                desc: '专为在本地机器上便捷部署和运行大型语言模型（LLM）而设计',
                link: 'https://ollama.com'
            },
            {
                icon: '/images/nav/huggingface.png',
                title: 'Hugging Face',
                desc: '开源的机器学习平台，专注于自然语言处理（NLP）和人工智能（AI）',
                link: 'https://huggingface.co'
            },
            {
                icon: '/images/nav/vllm.png',
                title: 'vLLM',
                desc: 'vLLM 是一个快速、易于使用的 LLM 推理和服务库',
                link: 'https://docs.vllm.ai'
            }
        ]
    },
    {
        title: 'Golang',
        items: [
            {
                icon: '/images/nav/cloudwego.png',
                title: 'CloudWeGo',
                desc: '字节跳动推出的一套开源中间件，可用于快速构建企业级云原生架构',
                link: 'https://www.cloudwego.io'
            },
            {
                icon: '/images/nav/go-kratos.png',
                title: 'Kratos',
                desc: 'Kratos 是一个基于 Golang 实现的轻量级微服务框架',
                link: 'https://go-kratos.dev'
            },
            {
                icon: '/images/nav/go-zero.png',
                title: 'go-zero',
                desc: 'go-zero 是一个内置大量工程实践的 Web 和 RPC 框架',
                link: 'https://go-zero.dev'
            }
        ]
    },
    {
        title: 'Java',
        items: [
            {
                icon: '/images/nav/spring.png',
                title: 'Spring',
                desc: '世界上最受欢迎的 Java 框架生态',
                link: 'https://spring.io'
            },
            {
                icon: '/images/nav/vertx.png',
                title: 'Vert.x™',
                desc: '基于 JVM 的开源、异步、事件驱动的应用程序框架',
                link: 'https://vertx.io'
            },
            {
                icon: '/images/nav/jhipster.png',
                title: 'JHipster',
                desc: 'JHipster 是一个开发平台，用于快速生成、开发和部署现代 Web 应用程序和微服务架构',
                link: 'https://www.jhipster.tech'
            },
            {
                icon: '/images/nav/quarkus.png',
                title: 'Quarkus',
                desc: '一个为Java 虚拟机（JVM）和原生编译而设计的全堆栈Kubernetes 原生Java 框架',
                link: 'https://quarkus.io'
            },
            {
                icon: '/images/nav/gradle.png',
                title: 'Gradle',
                desc: 'Java、Android 和 Kotlin 开发者的首选开源构建系统',
                link: 'https://gradle.org'
            }
        ]
    },
    {
        title: 'React生态',
        items: [
            {
                icon: '/images/nav/react.png',
                title: 'React',
                desc: '一个自由及开放源代码的前端JavaScript工具库',
                link: 'https://react.dev'
            }
        ]
    },
    {
        title: 'Vue生态',
        items: [
            {
                icon: '/images/nav/vue.png',
                title: 'Vue',
                desc: '渐进式 JavaScript 框架，用于构建用户界面',
                link: 'https://vuejs.org'
            }
        ]
    },
    {
        title: '社区',
        items: [
            {
                icon: '/images/nav/github.png',
                title: 'GitHub',
                desc: '全球最大的代码托管平台',
                link: 'https://github.com'
            },
            {
                icon: '/images/nav/stackoverflow.png',
                title: 'Stack Overflow',
                desc: '全球最大的技术问答社区',
                link: 'https://stackoverflow.com'
            },
            {
                icon: '/images/nav/leetcode.png',
                title: 'LeetCode',
                desc: '提供用户练习编码和算法练习的在线平台',
                link: 'https://leetcode.com'
            }
        ]
    }
]