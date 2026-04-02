// Leave Types
export const LEAVE_TYPES = {
  EARNED: 'Earned Leave',
  NON_ENCASHABLE: 'Non - Encashable',
  SICK: 'Sick Leave',
  C_OFF: 'C-Off(Compensatory Off)',
  LWP: 'Leave without pay (LWP)',
};

// Leave Status
export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled'
};

// Departments
export const DEPARTMENTS = [
  {
    label: 'Engineering',
    options: [
      'Civil',
      'Computer',
      'IT',
      'Electrical',
      'Mechanical',
      'Production',
      'Structural',
      'Textile',
      'Environmental',
    ],
  },
  { label: 'Humanities & Management', options: ['Humanities & Management'] },
  { label: 'Mathematics', options: ['Mathematics'] },
  { label: 'Master of Computer Applications', options: ['Master of Computer Applications'] },
  { label: 'Physics', options: ['Physics'] },
  { label: 'Technical & Applied Chemistry', options: ['Technical & Applied Chemistry'] },
];

// Status Colors for UI
export const STATUS_COLORS = {
  [LEAVE_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [LEAVE_STATUS.APPROVED]: 'bg-green-100 text-green-800',
  [LEAVE_STATUS.REJECTED]: 'bg-red-100 text-red-800',
  [LEAVE_STATUS.CANCELLED]: 'bg-gray-100 text-gray-800'
};

// API Endpoints
export const API_ENDPOINTS = {
  LEAVE_BALANCE: '/api/faculty/leave-balance',
  PENDING_REQUESTS: '/api/faculty/pending-requests',
  MY_APPLICATIONS: '/api/faculty/my-applications',
  APPLY_LEAVE: '/api/faculty/apply-leave',
  CALENDAR_EVENTS: '/api/faculty/calendar-events'
};

// Default Leave Balance
export const DEFAULT_LEAVE_BALANCE = {
  casual: 12,
  emergency: 10,
  SlDl: 20,
 
};