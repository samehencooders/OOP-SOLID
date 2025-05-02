import { Task, User, Project, WorkflowStage } from '../models/task.model';

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'Developer',
    department: 'Engineering',
    xpPoints: 1250,
    badges: [
      { id: 'badge1', name: 'Task Master', description: 'Completed 50 tasks', icon: 'star', earnedAt: new Date('2023-01-15') },
      { id: 'badge2', name: 'Early Bird', description: 'Completed 10 tasks before deadline', icon: 'alarm', earnedAt: new Date('2023-02-20') }
    ],
    skills: [
      { id: 'skill1', name: 'Angular', level: 4 },
      { id: 'skill2', name: 'TypeScript', level: 5 },
      { id: 'skill3', name: 'Node.js', level: 3 }
    ]
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'Designer',
    department: 'Design',
    xpPoints: 980,
    badges: [
      { id: 'badge3', name: 'Design Guru', description: 'Created 20 designs', icon: 'palette', earnedAt: new Date('2023-03-10') }
    ],
    skills: [
      { id: 'skill4', name: 'UI Design', level: 5 },
      { id: 'skill5', name: 'Figma', level: 4 },
      { id: 'skill6', name: 'CSS', level: 3 }
    ]
  },
  {
    id: 'user3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://i.pravatar.cc/150?img=8',
    role: 'Product Manager',
    department: 'Product',
    xpPoints: 1500,
    badges: [
      { id: 'badge4', name: 'Project Leader', description: 'Led 5 successful projects', icon: 'groups', earnedAt: new Date('2023-01-05') }
    ],
    skills: [
      { id: 'skill7', name: 'Product Management', level: 5 },
      { id: 'skill8', name: 'Agile', level: 4 },
      { id: 'skill9', name: 'Roadmapping', level: 4 }
    ]
  }
];

// Mock Tasks
export const MOCK_TASKS: Task[] = [
  {
    id: 'task1',
    title: 'Implement user authentication',
    description: 'Create login and registration functionality with JWT authentication',
    status: 'In Progress',
    priority: 'high',
    dueDate: new Date('2023-06-15'),
    assignee: MOCK_USERS[0],
    tags: ['frontend', 'security', 'auth'],
    attachments: [],
    comments: [
      {
        id: 'comment1',
        content: 'I\'ve started working on this. Will use Angular Material for the forms.',
        createdAt: new Date('2023-06-01'),
        author: MOCK_USERS[0],
        mentions: []
      }
    ],
    checklists: [
      {
        id: 'checklist1',
        title: 'Authentication Tasks',
        items: [
          { id: 'item1', content: 'Create login form', completed: true, assignee: MOCK_USERS[0] },
          { id: 'item2', content: 'Implement JWT handling', completed: false },
          { id: 'item3', content: 'Add password reset functionality', completed: false }
        ]
      }
    ],
    createdAt: new Date('2023-05-28'),
    updatedAt: new Date('2023-06-01'),
    estimatedTime: 8,
    actualTime: 3,
    riskScore: 25,
    aiSuggestions: [
      'Consider adding two-factor authentication',
      'Based on similar tasks, this might take 2 more days than estimated'
    ]
  },
  {
    id: 'task2',
    title: 'Design dashboard UI',
    description: 'Create wireframes and high-fidelity designs for the main dashboard',
    status: 'To Do',
    priority: 'medium',
    dueDate: new Date('2023-06-20'),
    assignee: MOCK_USERS[1],
    tags: ['design', 'ui', 'dashboard'],
    attachments: [],
    comments: [],
    checklists: [
      {
        id: 'checklist2',
        title: 'Design Tasks',
        items: [
          { id: 'item4', content: 'Create wireframes', completed: false },
          { id: 'item5', content: 'Get feedback from team', completed: false },
          { id: 'item6', content: 'Finalize high-fidelity designs', completed: false }
        ]
      }
    ],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-06-01'),
    estimatedTime: 12,
    actualTime: 0,
    riskScore: 15
  },
  {
    id: 'task3',
    title: 'Define MVP requirements',
    description: 'Work with stakeholders to define the minimum viable product requirements',
    status: 'Done',
    priority: 'critical',
    dueDate: new Date('2023-05-30'),
    assignee: MOCK_USERS[2],
    tags: ['planning', 'requirements', 'mvp'],
    attachments: [],
    comments: [
      {
        id: 'comment2',
        content: 'I\'ve scheduled meetings with all stakeholders for next week.',
        createdAt: new Date('2023-05-20'),
        author: MOCK_USERS[2],
        mentions: []
      },
      {
        id: 'comment3',
        content: '@John Doe can you join the meeting with the engineering team?',
        createdAt: new Date('2023-05-21'),
        author: MOCK_USERS[2],
        mentions: [MOCK_USERS[0]]
      }
    ],
    checklists: [
      {
        id: 'checklist3',
        title: 'Requirements Gathering',
        items: [
          { id: 'item7', content: 'Interview stakeholders', completed: true },
          { id: 'item8', content: 'Document requirements', completed: true },
          { id: 'item9', content: 'Get sign-off', completed: true }
        ]
      }
    ],
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-30'),
    estimatedTime: 20,
    actualTime: 18,
    riskScore: 0
  },
  {
    id: 'task4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for continuous integration and deployment',
    status: 'To Do',
    priority: 'high',
    dueDate: new Date('2023-06-25'),
    assignee: null,
    tags: ['devops', 'ci-cd', 'automation'],
    attachments: [],
    comments: [],
    checklists: [
      {
        id: 'checklist4',
        title: 'CI/CD Tasks',
        items: [
          { id: 'item10', content: 'Set up GitHub Actions workflow', completed: false },
          { id: 'item11', content: 'Configure build process', completed: false },
          { id: 'item12', content: 'Set up deployment to staging', completed: false },
          { id: 'item13', content: 'Set up deployment to production', completed: false }
        ]
      }
    ],
    createdAt: new Date('2023-06-02'),
    updatedAt: new Date('2023-06-02'),
    estimatedTime: 10,
    actualTime: 0,
    riskScore: 40
  },
  {
    id: 'task5',
    title: 'Implement analytics dashboard',
    description: 'Create charts and visualizations for key performance metrics',
    status: 'In Progress',
    priority: 'medium',
    dueDate: new Date('2023-06-30'),
    assignee: MOCK_USERS[0],
    tags: ['frontend', 'analytics', 'charts'],
    attachments: [],
    comments: [],
    checklists: [
      {
        id: 'checklist5',
        title: 'Analytics Implementation',
        items: [
          { id: 'item14', content: 'Select charting library', completed: true },
          { id: 'item15', content: 'Implement data fetching', completed: true },
          { id: 'item16', content: 'Create chart components', completed: false },
          { id: 'item17', content: 'Add filtering options', completed: false }
        ]
      }
    ],
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2023-06-10'),
    estimatedTime: 15,
    actualTime: 6,
    riskScore: 20
  }
];

// Mock Workflow Stages
export const MOCK_STAGES: WorkflowStage[] = [
  {
    id: 'stage1',
    name: 'To Do',
    order: 1,
    wipLimit: 10,
    tasks: MOCK_TASKS.filter(task => task.status === 'To Do'),
    color: '#e0e0e0',
    isEntryPoint: true,
    isExitPoint: false
  },
  {
    id: 'stage2',
    name: 'In Progress',
    order: 2,
    wipLimit: 5,
    tasks: MOCK_TASKS.filter(task => task.status === 'In Progress'),
    color: '#bbdefb',
    isEntryPoint: false,
    isExitPoint: false
  },
  {
    id: 'stage3',
    name: 'Review',
    order: 3,
    wipLimit: 3,
    tasks: [],
    color: '#fff9c4',
    isEntryPoint: false,
    isExitPoint: false
  },
  {
    id: 'stage4',
    name: 'Done',
    order: 4,
    wipLimit: 0,
    tasks: MOCK_TASKS.filter(task => task.status === 'Done'),
    color: '#c8e6c9',
    isEntryPoint: false,
    isExitPoint: true
  }
];

// Mock Projects
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'project1',
    name: 'Task Planner MVP',
    description: 'Develop the minimum viable product for the task planning application',
    stages: MOCK_STAGES,
    members: MOCK_USERS,
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date('2023-06-01'),
    dueDate: new Date('2023-08-31'),
    progress: 35,
    riskScore: 25
  },
  {
    id: 'project2',
    name: 'Marketing Website Redesign',
    description: 'Redesign the company marketing website with new branding',
    stages: [
      {
        id: 'stage5',
        name: 'Backlog',
        order: 1,
        wipLimit: 0,
        tasks: [],
        color: '#e0e0e0',
        isEntryPoint: true,
        isExitPoint: false
      },
      {
        id: 'stage6',
        name: 'Design',
        order: 2,
        wipLimit: 3,
        tasks: [],
        color: '#bbdefb',
        isEntryPoint: false,
        isExitPoint: false
      },
      {
        id: 'stage7',
        name: 'Development',
        order: 3,
        wipLimit: 5,
        tasks: [],
        color: '#fff9c4',
        isEntryPoint: false,
        isExitPoint: false
      },
      {
        id: 'stage8',
        name: 'Testing',
        order: 4,
        wipLimit: 2,
        tasks: [],
        color: '#ffccbc',
        isEntryPoint: false,
        isExitPoint: false
      },
      {
        id: 'stage9',
        name: 'Deployed',
        order: 5,
        wipLimit: 0,
        tasks: [],
        color: '#c8e6c9',
        isEntryPoint: false,
        isExitPoint: true
      }
    ],
    members: [MOCK_USERS[1], MOCK_USERS[2]],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-06-01'),
    dueDate: new Date('2023-07-15'),
    progress: 10,
    riskScore: 15
  }
];
