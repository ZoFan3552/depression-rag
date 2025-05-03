const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "欢迎使用",
      getStarted: "开始使用",
    },
    llm: {
      title: "语言模型偏好设置",
      description:
        "抑郁症专家知识库系统可以与多种语言模型提供商协同工作。这将是处理聊天服务的核心。",
    },
    userSetup: {
      title: "用户设置",
      description: "配置您的用户设置。",
      howManyUsers: "有多少用户将使用此实例？",
      justMe: "仅我自己",
      myTeam: "我的团队",
      instancePassword: "实例密码",
      setPassword: "您想要设置密码吗？",
      passwordReq: "密码必须至少包含8个字符。",
      passwordWarn:
        "请务必保存此密码，因为没有恢复方法。",

      adminUsername: "管理员账户用户名",
      adminUsernameReq:
        "用户名必须至少包含6个字符，且只能包含小写字母、数字、下划线和连字符，不能有空格。",
      adminPassword: "管理员账户密码",
      adminPasswordReq: "密码必须至少包含8个字符。",
      teamHint:
        "默认情况下，您将是唯一的管理员。完成入职后，您可以创建并邀请其他人成为用户或管理员。请勿丢失您的密码，因为只有管理员可以重置密码。",
    },
    data: {
      title: "数据处理与隐私",
      description:
        "我们致力于在处理您的个人数据时保持透明度和控制权。",
      settingsHint:
        "这些设置可以随时在设置页面重新配置。",
    },
    survey: {
      title: "欢迎使用抑郁症专家知识库系统",
      description: "帮助我们打造适合您需求的抑郁症专家知识库系统。（可选）",

      email: "您的电子邮箱是？",
      useCase: "您将如何使用抑郁症专家知识库系统？",
      useCaseWork: "工作用途",
      useCasePersonal: "个人用途",
      useCaseOther: "其他",
      comment: "您是如何了解到抑郁症专家知识库系统的？",
      commentPlaceholder:
        "Reddit、Twitter、GitHub、YouTube等 - 请告诉我们您是如何找到我们的！",
      skip: "跳过调查",
      thankYou: "感谢您的反馈！",
    },
    workspace: {
      title: "创建您的第一个工作区",
      description:
        "创建您的第一个工作区并开始使用抑郁症专家知识库系统。",
    },
  },
  common: {
    "workspaces-name": "工作区名称",
    error: "错误",
    success: "成功",
    user: "用户",
    selection: "模型选择",
    saving: "正在保存...",
    save: "保存更改",
    previous: "上一页",
    next: "下一页",
    optional: "可选",
    yes: "是",
    no: "否",
  },

  // 设置侧边栏菜单项
  settings: {
    title: "实例设置",
    system: "通用设置",
    invites: "邀请",
    users: "用户",
    workspaces: "工作区",
    "workspace-chats": "工作区聊天",
    customization: "个性化设置",
    interface: "界面设置",
    branding: "品牌与白标",
    chat: "聊天设置",
    "api-keys": "开发者API",
    llm: "语言模型",
    transcription: "转录",
    embedder: "嵌入引擎",
    "text-splitting": "文本分割与分块",
    "voice-speech": "语音与朗读",
    "vector-database": "向量数据库",
    embeds: "聊天嵌入",
    "embed-chats": "聊天嵌入历史",
    security: "安全",
    "event-logs": "事件日志",
    privacy: "隐私与数据",
    "ai-providers": "AI提供商",
    "agent-skills": "抑郁症专家智能助手技能",
    admin: "管理员",
    tools: "工具",
    "system-prompt-variables": "系统提示变量",
    "experimental-features": "实验性功能",
    contact: "联系支持",
    "browser-extension": "浏览器扩展",
  },

  // 页面定义
  login: {
    "multi-user": {
      welcome: "欢迎使用",
      "placeholder-username": "用户名",
      "placeholder-password": "密码",
      login: "登录",
      validating: "验证中...",
      "forgot-pass": "忘记密码",
      reset: "重置",
    },
    "sign-in": {
      start: "登录到您的",
      end: "账户。",
    },
    "password-reset": {
      title: "密码重置",
      description:
        "请提供以下必要信息以重置您的密码。",
      "recovery-codes": "恢复代码",
      "recovery-code": "恢复代码 {{index}}",
      "back-to-login": "返回登录",
    },
  },

  welcomeMessage: {
    part1:
      "欢迎使用抑郁症专家知识库系统，这是一个可以将任何内容转变为可查询和聊天的训练型聊天机器人的开源AI工具。抑郁症专家知识库系统采用BYOK（自带密钥）方式，因此除了您想要使用的服务外，本软件不收取任何订阅费、费用或收费。",
    part2:
      "抑郁症专家知识库系统是将强大的AI产品如OpenAI、GPT-4、LangChain、PineconeDB、ChromaDB和其他服务整合在一起的最简单方式，无需复杂设置，让您的工作效率提高100倍。",
    part3:
      "抑郁症专家知识库系统可以完全在您的本地机器上运行，几乎不会占用资源，您甚至不会注意到它的存在！无需GPU。同样支持云端和本地安装。\nAI工具生态系统每天都在变得更加强大。抑郁症专家知识库系统让使用变得简单。",
    githubIssue: "在GitHub上创建问题",
    user1: "我该如何开始？",
    part4:
      "很简单。所有的收集内容都组织在我们称为”工作区“的存储桶中。工作区是文件、文档、图像、PDF和其他文件的存储桶，这些将被转换为语言模型可以理解并在对话中使用的内容。\n\n您可以随时添加和删除文件。",
    createWorkspace: "创建您的第一个工作区",
    user2:
      "这是一种AI文件盒或类似的东西吗？那聊天呢？它不是一个聊天机器人吗？",
    part5:
      "抑郁症专家知识库系统不仅仅是一个更智能的文件盒。\n\n抑郁症专家知识库系统提供两种与您的数据交流的方式：\n\n<i>查询模式：</i>您的聊天将返回在工作区文档中找到的数据或推断。添加更多文档到工作区会使它变得更智能！\n\n<i>对话模式：</i>您的文档和正在进行的聊天历史同时为语言模型知识做出贡献。非常适合追加实时基于文本的信息或纠正语言模型可能有的误解。\n\n您可以在<i>聊天过程中</i>切换这两种模式！",
    user3: "哇，这听起来很棒，让我立即试试！",
    part6: "祝您使用愉快！",
    starOnGitHub: "在GitHub上加星标",
    contact: "联系我们",
  },

  "main-page": {
    noWorkspaceError: "请在开始聊天前创建一个工作区。",
    checklist: {
      title: "入门指南",
      tasksLeft: "剩余任务",
      completed: "您正在成为抑郁症专家知识库系统专家的路上！",
      dismiss: "关闭",
      tasks: {
        create_workspace: {
          title: "创建工作区",
          description: "创建您的第一个工作区以开始使用",
          action: "创建",
        },
        send_chat: {
          title: "发送聊天",
          description: "开始与您的AI助手对话",
          action: "聊天",
        },
        embed_document: {
          title: "嵌入文档",
          description: "添加您的第一个文档到工作区",
          action: "嵌入",
        },
        setup_system_prompt: {
          title: "设置系统提示",
          description: "配置您的AI助手行为",
          action: "设置",
        },
        define_slash_command: {
          title: "定义斜杠命令",
          description: "为您的助手创建自定义命令",
          action: "定义",
        },
        visit_community: {
          title: "访问社区中心",
          description: "探索社区资源和模板",
          action: "浏览",
        },
      },
    },
    quickLinks: {
      title: "快速链接",
      sendChat: "发送聊天",
      embedDocument: "嵌入文档",
      createWorkspace: "创建工作区",
    },
    exploreMore: {
      title: "探索更多功能",
      features: {
        customAgents: {
          title: "自定义AI抑郁症专家智能助手",
          description: "无需编码构建强大的AI抑郁症专家智能助手和自动化流程。",
          primaryAction: "使用@agent聊天",
          secondaryAction: "构建抑郁症专家智能助手流程",
        },
        slashCommands: {
          title: "斜杠命令",
          description:
            "使用自定义斜杠命令节省时间并注入提示。",
          primaryAction: "创建斜杠命令",
          secondaryAction: "在社区中探索",
        },
        systemPrompts: {
          title: "系统提示",
          description:
            "修改系统提示以自定义工作区的AI回复。",
          primaryAction: "修改系统提示",
          secondaryAction: "管理提示变量",
        },
      },
    },
    announcements: {
      title: "更新与公告",
    },
    resources: {
      title: "资源",
      links: {
        docs: "文档",
        star: "在GitHub上加星标",
      },
    },
  },

  "new-workspace": {
    title: "新工作区",
    placeholder: "我的工作区",
  },

  // 工作区设置菜单项
  "workspaces—settings": {
    general: "通用设置",
    chat: "聊天设置",
    vector: "向量数据库",
    members: "成员",
    agent: "抑郁症专家智能助手配置",
  },

  // 通用外观
  general: {
    vector: {
      title: "向量数量",
      description: "您的向量数据库中的向量总数。",
    },
    names: {
      description: "这只会更改工作区的显示名称。",
    },
    message: {
      title: "建议的聊天消息",
      description:
        "自定义将向工作区用户建议的消息。",
      add: "添加新消息",
      save: "保存消息",
      heading: "向我解释",
      body: "抑郁症专家知识库系统的好处",
    },
    pfp: {
      title: "助手个人形象",
      description:
        "为该工作区的助手自定义个人形象。",
      image: "工作区图像",
      remove: "移除工作区图像",
    },
    delete: {
      title: "删除工作区",
      description:
        "删除此工作区及其所有数据。这将为所有用户删除工作区。",
      delete: "删除工作区",
      deleting: "正在删除工作区...",
      "confirm-start": "您即将删除整个",
      "confirm-end":
        "工作区。这将移除向量数据库中的所有向量嵌入。\n\n原始源文件将保持不变。此操作不可逆。",
    },
  },

  // 聊天设置
  chat: {
    llm: {
      title: "工作区语言模型提供商",
      description:
        "将用于此工作区的特定语言模型提供商和模型。默认情况下，它使用系统语言模型提供商和设置。",
      search: "搜索所有语言模型提供商",
    },
    model: {
      title: "工作区聊天模型",
      description:
        "将用于此工作区的特定聊天模型。如果为空，将使用系统语言模型偏好。",
      wait: "-- 等待模型加载 --",
    },
    mode: {
      title: "聊天模式",
      chat: {
        title: "聊天",
        "desc-start": "将使用语言模型的通用知识",
        and: "和",
        "desc-end": "找到的文档上下文提供答案。",
      },
      query: {
        title: "查询",
        "desc-start": "将",
        only: "仅",
        "desc-end": "在找到文档上下文时提供答案。",
      },
    },
    history: {
      title: "聊天历史",
      "desc-start":
        "将包含在响应短期记忆中的先前聊天数量。",
      recommend: "建议20条。",
      "desc-end":
        "超过45条可能会导致持续的聊天失败，具体取决于消息大小。",
    },
    prompt: {
      title: "提示",
      description:
        "将在此工作区使用的提示。为AI定义上下文和指令以生成响应。您应该提供精心设计的提示，以便AI生成相关且准确的响应。",
    },
    refusal: {
      title: "查询模式拒绝响应",
      "desc-start": "当处于",
      query: "查询",
      "desc-end":
        "模式时，您可能希望在未找到上下文时返回自定义拒绝响应。",
    },
    temperature: {
      title: "语言模型温度",
      "desc-start":
        "此设置控制您的语言模型响应的”创造性“程度。",
      "desc-end":
        "数字越高，创造性越强。对于某些模型，如果设置得太高，可能会导致不连贯的响应。",
      hint: "大多数语言模型有各种可接受的有效值范围。请咨询您的语言模型提供商获取该信息。",
    },
  },

  // 向量数据库
  "vector-workspace": {
    identifier: "向量数据库标识符",
    snippets: {
      title: "最大上下文片段",
      description:
        "此设置控制每次聊天或查询将发送给语言模型的最大上下文片段数量。",
      recommend: "推荐：4",
    },
    doc: {
      title: "文档相似度阈值",
      description:
        "将源视为与聊天相关所需的最低相似度分数。数字越高，源必须与聊天越相似。",
      zero: "无限制",
      low: "低（相似度分数 ≥ .25）",
      medium: "中（相似度分数 ≥ .50）",
      high: "高（相似度分数 ≥ .75）",
    },
    reset: {
      reset: "重置向量数据库",
      resetting: "正在清除向量...",
      confirm:
        "您即将重置此工作区的向量数据库。这将移除当前嵌入的所有向量嵌入。\n\n原始源文件将保持不变。此操作不可逆。",
      error: "工作区向量数据库无法重置！",
      success: "工作区向量数据库已重置！",
    },
  },

  // 抑郁症专家智能助手配置
  agent: {
    "performance-warning":
      "不明确支持工具调用的语言模型的性能高度依赖于模型的能力和准确性。某些功能可能受限或无法正常工作。",
    provider: {
      title: "工作区抑郁症专家智能助手语言模型提供商",
      description:
        "将用于此工作区@agent抑郁症专家智能助手的特定语言模型提供商和模型。",
    },
    mode: {
      chat: {
        title: "工作区抑郁症专家智能助手聊天模型",
        description:
          "将用于此工作区@agent抑郁症专家智能助手的特定聊天模型。",
      },
      title: "工作区抑郁症专家智能助手模型",
      description:
        "将用于此工作区@agent抑郁症专家智能助手的特定语言模型。",
      wait: "-- 等待模型加载 --",
    },

    skill: {
      title: "默认抑郁症专家智能助手技能",
      description:
        "使用这些预建技能提升默认抑郁症专家智能助手的自然能力。此设置适用于所有工作区。",
      rag: {
        title: "RAG和长期记忆",
        description:
          "允许抑郁症专家智能助手利用您的本地文档回答查询，或要求抑郁症专家智能助手”记住“内容片段以便长期记忆检索。",
      },
      view: {
        title: "查看和总结文档",
        description:
          "允许抑郁症专家智能助手列出和总结当前嵌入的工作区文件内容。",
      },
      scrape: {
        title: "抓取网站",
        description:
          "允许抑郁症专家智能助手访问并抓取网站内容。",
      },
      generate: {
        title: "生成图表",
        description:
          "使默认抑郁症专家智能助手能够从提供的数据或聊天中给出的数据生成各种类型的图表。",
      },
      save: {
        title: "生成并保存文件到浏览器",
        description:
          "使默认抑郁症专家智能助手能够生成并写入可在浏览器中保存和下载的文件。",
      },
      web: {
        title: "实时网络搜索和浏览",
        "desc-start":
          "通过连接到网络搜索（SERP）提供商，使您的抑郁症专家智能助手能够搜索网络以回答您的问题。",
        "desc-end":
          "在设置完成之前，抑郁症专家智能助手会话期间的网络搜索将无法工作。",
      },
    },
  },

  // 工作区聊天
  recorded: {
    title: "工作区聊天",
    description:
      "这些是所有由用户发送的记录聊天和消息，按创建日期排序。",
    export: "导出",
    table: {
      id: "ID",
      by: "发送者",
      workspace: "工作区",
      prompt: "提示",
      response: "响应",
      at: "发送时间",
    },
  },

  customization: {
    interface: {
      title: "界面设置",
      description: "自定义应用程序的界面外观与行为"
    },
    branding: {
      title: "品牌与白标",
      description:
        "使用自定义品牌为您的抑郁症专家知识库系统实例进行白标处理。",
    },
    chat: {
      title: "聊天设置",
      description: "配置您的抑郁症专家知识库系统聊天偏好。",
      auto_submit: {
        title: "自动提交语音输入",
        description: "在一段时间的静默后自动提交语音输入"
      },
      auto_speak: {
        title: "自动朗读回复",
        description: "自动朗读AI助手的回复内容"
      }
    },
    items: {
      theme: {
        title: "主题",
        description: "选择您偏好的应用程序颜色主题。",
      },
      "show-scrollbar": {
        title: "聊天界面滚动条",
        description: "控制聊天界面是否显示滚动条",
      },
      "support-email": {
        title: "支持邮箱",
        description:
          "设置用户需要帮助时应可访问的支持邮箱地址。",
      },
      "app-name": {
        title: "名称",
        description:
          "设置在登录页面上向所有用户显示的名称。",
      },
      "chat-message-alignment": {
        title: "聊天消息布局",
        description:
          "选择聊天时的消息是否保持同侧",
      },
      "display-language": {
        title: "显示语言",
        description:
          "选择渲染抑郁症专家知识库系统界面的首选语言（当翻译可用时）。",
      },
      logo: {
        title: "品牌标志",
        description: "上传您的自定义标志以在所有页面上展示。",
        add: "添加自定义标志",
        recommended: "推荐尺寸：800 x 200",
        remove: "移除",
        replace: "替换",
      },
      "welcome-messages": {
        title: "欢迎消息",
        description:
          "自定义向用户显示的欢迎消息。只有非管理员用户会看到这些消息。",
        new: "新建",
        system: "系统",
        user: "用户",
        message: "消息",
        assistant: "抑郁症专家聊天助手",
        "double-click": "双击编辑...",
        save: "保存消息",
      },
      "browser-appearance": {
        title: "浏览器外观",
        description:
          "自定义应用程序打开时浏览器标签和标题的外观。",
        tab: {
          title: "标题",
          description:
            "当应用程序在浏览器中打开时设置自定义标签标题。",
        },
        favicon: {
          title: "网站图标",
          description: "为浏览器标签使用自定义网站图标。",
        },
      },
      "sidebar-footer": {
        title: "侧边栏底部项目",
        description:
          "自定义侧边栏底部显示的底部项目。",
        icon: "图标",
        link: "链接",
      },
    },
  },

  // API密钥
  api: {
    title: "API密钥",
    description:
      "API密钥允许持有者以编程方式访问和管理此抑郁症专家知识库系统实例。",
    link: "阅读API文档",
    generate: "生成新API密钥",
    table: {
      key: "API密钥",
      by: "创建者",
      created: "创建时间",
    },
  },

  llm: {
    title: "语言模型偏好",
    description:
      "这些是您首选的语言模型聊天和嵌入提供商的凭据和设置。这些密钥必须是最新和正确的，否则抑郁症专家知识库系统将无法正常运行。",
    provider: "语言模型提供商",
  },

  transcription: {
    title: "转录模型偏好",
    description:
      "这些是您首选的转录模型提供商的凭据和设置。这些密钥必须是最新和正确的，否则媒体文件和音频将无法转录。",
    provider: "转录提供商",
    "warn-start":
      "在RAM或CPU有限的机器上使用本地Whisper模型处理媒体文件时可能会使抑郁症专家知识库系统停滞。",
    "warn-recommend":
      "我们建议至少有2GB的RAM，并上传小于10Mb的文件。",
    "warn-end":
      "内置模型将在首次使用时自动下载。",
  },

  embedding: {
    title: "嵌入偏好",
    "desc-start":
      "当使用不原生支持嵌入引擎的语言模型时，您可能需要额外指定嵌入文本的凭据。",
    "desc-end":
      "嵌入是将文本转换为向量的过程。这些凭据是将您的文件和提示转换为抑郁症专家知识库系统可使用的格式所必需的。",
    provider: {
      title: "嵌入提供商",
      description:
        "使用抑郁症专家知识库系统的原生嵌入引擎时不需要设置。",
    },
  },

  text: {
    title: "文本分割和分块偏好",
    "desc-start":
      "有时，您可能想要更改在将新文档插入向量数据库之前分割和分块的默认方式。",
    "desc-end":
      "只有在您了解文本分割的工作原理及其副作用时才应修改此设置。",
    "warn-start": "这里的更改将仅适用于",
    "warn-center": "新嵌入的文档",
    "warn-end": "，而非现有文档。",
    size: {
      title: "文本块大小",
      description:
        "这是单个向量中可以存在的最大字符长度。",
      recommend: "嵌入模型最大长度为",
    },

    overlap: {
      title: "文本块重叠",
      description:
        "这是在分块期间两个相邻文本块之间发生的最大字符重叠。",
    },
  },

  // 向量数据库
  vector: {
    title: "向量数据库",
    description:
      "这些是您的抑郁症专家知识库系统实例如何运行的凭据和设置。这些密钥必须是最新和正确的。",
    provider: {
      title: "向量数据库提供商",
      description: "LanceDB不需要配置。",
    },
  },

  // 可嵌入聊天小部件
  embeddable: {
    title: "可嵌入聊天小部件",
    description:
      "可嵌入聊天小部件是与单个工作区绑定的面向公众的聊天界面。这些允许您构建可以发布到全世界的工作区。",
    create: "创建嵌入",
    table: {
      workspace: "工作区",
      chats: "已发送聊天",
      Active: "活跃域名",
    },
  },

  "embed-chats": {
    title: "嵌入聊天记录",
    export: "导出",
    description:
      "这些是来自您发布的任何嵌入的所有记录聊天和消息。",
    table: {
      embed: "嵌入",
      sender: "发送者",
      message: "消息",
      response: "回复",
      at: "发送时间",
    },
  },

  multi: {
    title: "多用户模式",
    description:
      "通过激活多用户模式为您的团队设置实例。",
    enable: {
      "is-enable": "多用户模式已启用",
      enable: "启用多用户模式",
      description:
        "默认情况下，您将是唯一的管理员。作为管理员，您需要为所有新用户或管理员创建账户。请勿丢失您的密码，因为只有管理员用户可以重置密码。",
      username: "管理员账户用户名",
      password: "管理员账户密码",
    },
    password: {
      title: "密码保护",
      description:
        "使用密码保护您的抑郁症专家知识库系统实例。如果您忘记了密码，将没有恢复方法，所以请确保保存此密码。",
    },
    instance: {
      title: "密码保护实例",
      description:
        "默认情况下，您将是唯一的管理员。作为管理员，您需要为所有新用户或管理员创建账户。请勿丢失您的密码，因为只有管理员用户可以重置密码。",
      password: "实例密码",
    },
  },

  // 事件日志
  event: {
    title: "事件日志",
    description:
      "查看此实例上发生的所有操作和事件以进行监控。",
    clear: "清除事件日志",
    table: {
      type: "事件类型",
      user: "用户",
      occurred: "发生时间",
    },
  },

  // 隐私与数据处理
  privacy: {
    title: "隐私与数据处理",
    description:
      "这是您关于已连接的第三方提供商和抑郁症专家知识库系统如何处理您的数据的配置。",
    llm: "语言模型选择",
    embedding: "嵌入偏好",
    vector: "向量数据库",
    anonymous: "已启用匿名遥测",
  },

  connectors: {
    "search-placeholder": "搜索数据连接器",
    "no-connectors": "未找到数据连接器。",
    github: {
      name: "GitHub仓库",
      description:
        "一键导入整个公共或私有GitHub仓库。",
      URL: "GitHub仓库URL",
      URL_explained: "您希望收集的GitHub仓库的URL。",
      token: "GitHub访问令牌",
      optional: "可选",
      token_explained: "访问令牌可防止限速。",
      token_explained_start: "没有",
      token_explained_link1: "个人访问令牌",
      token_explained_middle:
        "，GitHub API可能会由于速率限制而限制可以收集的文件数量。您可以",
      token_explained_link2: "创建临时访问令牌",
      token_explained_end: "来避免此问题。",
      ignores: "文件忽略",
      git_ignore:
        "以.gitignore格式列出，在收集过程中忽略特定文件。输入每个条目后按回车保存。",
      task_explained:
        "完成后，所有文件将在文档选择器中可用于嵌入到工作区中。",
      branch: "您希望收集文件的分支。",
      branch_loading: "-- 正在加载可用分支 --",
      branch_explained: "您希望收集文件的分支。",
      token_information:
        "如果不填写<b>GitHub访问令牌</b>，由于GitHub公共API的速率限制，此数据连接器将只能收集仓库的<b>顶层</b>文件。",
      token_personal:
        "在此处使用GitHub账户获取免费个人访问令牌。",
    },
    gitlab: {
      name: "GitLab仓库",
      description:
        "一键导入整个公共或私有GitLab仓库。",
      URL: "GitLab仓库URL",
      URL_explained: "您希望收集的GitLab仓库的URL。",
      token: "GitLab访问令牌",
      optional: "可选",
      token_explained: "访问令牌可防止限速。",
      token_description:
        "选择要从GitLab API获取的其他实体。",
      token_explained_start: "没有",
      token_explained_link1: "个人访问令牌",
      token_explained_middle:
        "，GitLab API可能会由于速率限制而限制可以收集的文件数量。您可以",
      token_explained_link2: "创建临时访问令牌",
      token_explained_end: "来避免此问题。",
      fetch_issues: "将问题获取为文档",
      ignores: "文件忽略",
      git_ignore:
        "以.gitignore格式列出，在收集过程中忽略特定文件。输入每个条目后按回车保存。",
      task_explained:
        "完成后，所有文件将在文档选择器中可用于嵌入到工作区中。",
      branch: "您希望收集文件的分支",
      branch_loading: "-- 正在加载可用分支 --",
      branch_explained: "您希望收集文件的分支。",
      token_information:
        "如果不填写<b>GitLab访问令牌</b>，由于GitLab公共API的速率限制，此数据连接器将只能收集仓库的<b>顶层</b>文件。",
      token_personal:
        "在此处使用GitLab账户获取免费个人访问令牌。",
    },
    youtube: {
      name: "YouTube转录",
      description:
        "从链接导入整个YouTube视频的转录。",
      URL: "YouTube视频URL",
      URL_explained_start:
        "输入任何YouTube视频的URL以获取其转录。该视频必须有",
      URL_explained_link: "字幕",
      URL_explained_end: "可用。",
      task_explained:
        "完成后，转录将在文档选择器中可用于嵌入到工作区中。",
      language: "转录语言",
      language_explained:
        "选择您想要收集的转录的语言。",
      loading_languages: "-- 正在加载可用语言 --",
    },
    "website-depth": {
      name: "批量链接抓取器",
      description: "抓取网站及其子链接，直至特定深度。",
      URL: "网站URL",
      URL_explained: "您想要抓取的网站的URL。",
      depth: "爬取深度",
      depth_explained:
        "这是工作者应从原始URL跟踪的子链接数量。",
      max_pages: "最大页面数",
      max_pages_explained: "要抓取的最大链接数。",
      task_explained:
        "完成后，所有抓取的内容将在文档选择器中可用于嵌入到工作区中。",
    },
    confluence: {
      name: "Confluence",
      description: "一键导入整个Confluence页面。",
      deployment_type: "Confluence部署类型",
      deployment_type_explained:
        "确定您的Confluence实例是托管在Atlassian云上还是自托管。",
      base_url: "Confluence基础URL",
      base_url_explained: "这是您的Confluence空间的基础URL。",
      space_key: "Confluence空间键",
      space_key_explained:
        "这是将使用的您的Confluence实例的空间键。通常以~开头",
      username: "Confluence用户名",
      username_explained: "您的Confluence用户名",
      auth_type: "Confluence认证类型",
      auth_type_explained:
        "选择您要用来访问Confluence页面的认证类型。",
      auth_type_username: "用户名和访问令牌",
      auth_type_personal: "个人访问令牌",
      token: "Confluence访问令牌",
      token_explained_start:
        "您需要提供访问令牌进行认证。您可以",
      token_explained_link: "在此处",
      token_desc: "用于认证的访问令牌",
      pat_token: "Confluence个人访问令牌",
      pat_token_explained: "您的Confluence个人访问令牌。",
      task_explained:
        "完成后，页面内容将在文档选择器中可用于嵌入到工作区中。",
    },

    manage: {
      documents: "文档",
      "data-connectors": "数据连接器",
      "desktop-only":
        "编辑这些设置仅在桌面设备上可用。请在桌面上访问此页面继续。",
      dismiss: "关闭",
      editing: "正在编辑",
    },
    directory: {
      "my-documents": "我的文档",
      "new-folder": "新建文件夹",
      "search-document": "搜索文档",
      "no-documents": "没有文档",
      "move-workspace": "移动到工作区",
      name: "名称",
      "delete-confirmation":
        "您确定要删除这些文件和文件夹吗？\n这将从系统中移除文件，并自动从任何现有工作区中删除它们。\n此操作不可逆。",
      "removing-message":
        "正在移除{{count}}个文档和{{folderCount}}个文件夹。请稍候。",
      "move-success": "成功移动{{count}}个文档。",
      date: "日期",
      type: "类型",
      no_docs: "没有文档",
      select_all: "全选",
      deselect_all: "取消全选",
      remove_selected: "移除所选",
      costs: "*嵌入的一次性费用",
      save_embed: "保存并嵌入",
    },
    upload: {
      "processor-offline": "文档处理器不可用",
      "processor-offline-desc":
        "我们现在无法上传您的文件，因为文档处理器处于离线状态。请稍后再试。",
      "click-upload": "点击上传或拖放",
      "file-types":
        "支持文本文件、CSV文件、电子表格、音频文件等！",
      "or-submit-link": "或提交链接",
      "placeholder-link": "https://example.com",
      fetching: "正在获取...",
      "fetch-website": "获取网站",
      "privacy-notice":
        "这些文件将上传到在此抑郁症专家知识库系统实例上运行的文档处理器。这些文件不会发送或与第三方共享。",
    },
    pinning: {
      what_pinning: "什么是文档固定？",
      pin_explained_block1:
        "当您在抑郁症专家知识库系统中<b>固定</b>文档时，我们会将文档的全部内容注入到您的提示窗口中，以便您的语言模型完全理解。",
      pin_explained_block2:
        "这对<b>大上下文模型</b>或对其知识库至关重要的小文件效果最佳。",
      pin_explained_block3:
        "如果您默认情况下无法从抑郁症专家知识库系统获得满意的答案，那么固定是一种通过点击获得更高质量答案的好方法。",
      accept: "好的，明白了",
    },
    watching: {
      what_watching: "监视文档有什么作用？",
      watch_explained_block1:
        "当您在抑郁症专家知识库系统中<b>监视</b>文档时，我们将以固定间隔<i>自动</i>从其原始来源同步您的文档内容。这将自动更新该文件被管理的每个工作区中的内容。",
      watch_explained_block2:
        "此功能目前支持基于在线的内容，不适用于手动上传的文档。",
      watch_explained_block3_start:
        "您可以在",
      watch_explained_block3_link: "文件管理器",
      watch_explained_block3_end: "管理视图中管理被监视的文档。",
      accept: "好的，明白了",
    },
  },

  chat_window: {
    welcome: "欢迎来到您的新工作区",
    get_started: "开始使用",
    get_started_default: "开始使用",
    upload: "上传文档",
    or: "或",
    send_chat: "发送聊天",
    send_message: "发送消息",
    attach_file: "附加文件到此聊天",
    slash: "查看所有可用的斜杠命令",
    agents: "查看所有可用的抑郁症专家智能助手",
    text_size: "更改文本大小",
    microphone: "说出您的提示",
    send: "发送提示消息到工作区",
  },

  profile_settings: {
    edit_account: "编辑账户",
    profile_picture: "个人头像",
    remove_profile_picture: "移除个人头像",
    username: "用户名",
    username_description:
      "用户名必须只包含小写字母、数字、下划线和连字符，不能有空格",
    new_password: "新密码",
    passwort_description: "密码必须至少包含8个字符",
    cancel: "取消",
    update_account: "更新账户",
    theme: "主题偏好",
    language: "首选语言",
  },
};

export default TRANSLATIONS;
