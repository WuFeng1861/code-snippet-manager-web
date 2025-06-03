export default {
  app: {
    title: 'Code Snippet Manager',
    tagline: 'Easily manage and share your code snippets'
  },
  navigation: {
    home: 'Home',
    snippets: 'Snippets',
    createSnippet: 'Create Snippet',
    tags: 'Tags',
    profile: 'Profile'
  },
  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful',
    logoutSuccess: 'Logged out successfully',
    loginRequired: 'Please login first',
    guestMode: 'Guest Mode',
    enterGuestMode: 'Continue as Guest'
  },
  theme: {
    light: 'Light Mode',
    dark: 'Dark Mode'
  },
  language: {
    'zh-CN': 'Chinese',
    'en-US': 'English'
  },
  snippets: {
    title: 'Title',
    content: 'Content',
    description: 'Description',
    language: 'Programming Language',
    tags: 'Tags',
    create: 'Create Snippet',
    edit: 'Edit Snippet',
    delete: 'Delete Snippet',
    save: 'Save',
    cancel: 'Cancel',
    createSuccess: 'Created successfully',
    updateSuccess: 'Updated successfully',
    deleteSuccess: 'Deleted successfully',
    confirmDelete: 'Are you sure you want to delete this snippet?',
    noSnippets: 'No snippets yet',
    createFirst: 'Create your first snippet',
    uploadStatus: {
      uploaded: 'Uploaded',
      pending: 'Pending Upload',
      local: 'Local Storage'
    },
    syncStatus: {
      syncing: 'Syncing...',
      synced: 'Synced',
      failed: 'Sync Failed',
      offline: 'Offline Mode'
    },
    features: {
      management: {
        title: 'Code Snippet Management',
        description: 'Create, edit and organize your code snippets with support for multiple programming languages.'
      },
      access: {
        title: 'Online/Offline Access',
        description: 'Access your code snippets whether you\'re online or offline, with automatic synchronization for data security.'
      },
      organization: {
        title: 'Tag Organization',
        description: 'Use the tagging system to categorize code snippets and quickly find what you need.'
      }
    }
  },
  tags: {
    name: 'Name',
    create: 'Create Tag',
    edit: 'Edit Tag',
    delete: 'Delete Tag',
    visibility: 'Visibility',
    selectable: 'Selectable',
    unselectable: 'Unselectable',
    noTags: 'No tags yet',
    createFirst: 'Create your first tag',
    confirmDelete: 'Are you sure you want to delete this tag?'
  },
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    actions: 'Actions',
    back: 'Back',
    yes: 'Yes',
    no: 'No'
  },
  errors: {
    required: '{field} is required',
    minLength: '{field} must be at least {min} characters',
    maxLength: '{field} cannot exceed {max} characters',
    email: 'Please enter a valid email address',
    passwordMatch: 'Passwords do not match',
    networkError: 'Network error, please check your connection',
    unauthorized: 'Unauthorized, please login',
    forbidden: 'Access forbidden',
    notFound: 'Resource not found',
    serverError: 'Server error'
  }
}