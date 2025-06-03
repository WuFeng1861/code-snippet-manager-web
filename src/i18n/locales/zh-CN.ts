export default {
  app: {
    title: '代码片段管理系统',
    tagline: '轻松管理和分享您的代码片段'
  },
  navigation: {
    home: '首页',
    snippets: '代码片段',
    createSnippet: '创建片段',
    tags: '标签',
    profile: '个人资料'
  },
  auth: {
    login: '登录',
    register: '注册',
    logout: '退出登录',
    username: '用户名',
    email: '电子邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    loginSuccess: '登录成功',
    registerSuccess: '注册成功',
    logoutSuccess: '已成功退出登录',
    loginRequired: '请先登录',
    guestMode: '游客模式',
    enterGuestMode: '以游客身份继续'
  },
  theme: {
    light: '浅色模式',
    dark: '深色模式'
  },
  language: {
    'zh-CN': '中文',
    'en-US': '英文'
  },
  snippets: {
    title: '标题',
    content: '内容',
    description: '描述',
    language: '编程语言',
    tags: '标签',
    create: '创建片段',
    edit: '编辑片段',
    delete: '删除片段',
    save: '保存',
    cancel: '取消',
    createSuccess: '创建成功',
    updateSuccess: '更新成功',
    deleteSuccess: '删除成功',
    confirmDelete: '确定要删除这个代码片段吗？',
    noSnippets: '暂无代码片段',
    createFirst: '创建您的第一个代码片段',
    uploadStatus: {
      uploaded: '已上传',
      pending: '等待上传',
      local: '本地存储'
    },
    syncStatus: {
      syncing: '同步中...',
      synced: '已同步',
      failed: '同步失败',
      offline: '离线模式'
    },
    features: {
      management: {
        title: '代码片段管理',
        description: '轻松创建、编辑和组织您的代码片段，支持多种编程语言。'
      },
      access: {
        title: '在线/离线访问',
        description: '无论是否连接网络，都可以访问您的代码片段，自动同步确保数据安全。'
      },
      organization: {
        title: '标签组织',
        description: '使用标签系统对代码片段进行分类，快速找到您需要的内容。'
      }
    }
  },
  tags: {
    name: '名称',
    create: '创建标签',
    edit: '编辑标签',
    delete: '删除标签',
    visibility: '可见性',
    selectable: '可选择',
    unselectable: '不可选择',
    noTags: '暂无标签',
    createFirst: '创建您的第一个标签',
    confirmDelete: '确定要删除这个标签吗？'
  },
  common: {
    loading: '加载中...',
    error: '发生错误',
    retry: '重试',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    search: '搜索',
    filter: '筛选',
    actions: '操作',
    back: '返回',
    yes: '是',
    no: '否'
  },
  errors: {
    required: '{field}不能为空',
    minLength: '{field}长度不能少于{min}个字符',
    maxLength: '{field}长度不能超过{max}个字符',
    email: '请输入有效的电子邮箱地址',
    passwordMatch: '两次输入的密码不一致',
    networkError: '网络错误，请检查您的网络连接',
    unauthorized: '未授权，请登录',
    forbidden: '禁止访问',
    notFound: '资源不存在',
    serverError: '服务器错误'
  }
}