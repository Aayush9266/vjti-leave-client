import { API_ENDPOINTS, DEFAULT_LEAVE_BALANCE, LEAVE_STATUS, LEAVE_TYPES } from '../utils/constants';
import axios from 'axios';

// Mock API functions - Replace with actual API calls
class FacultyAPI {
  
  // Get leave balance for faculty
  // static async getLeaveBalance() {
  //   // Mock data - replace with actual API call
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve({
  //         success: true,
  //         data: DEFAULT_LEAVE_BALANCE
  //       });
  //     }, 500);
  //   });
  // }

  static async getLeaveBalance() {
    try {
      const token = localStorage.getItem('token'); // Adjust based on your token storage
      const response = await axios.get('/api/emergencyleave/balance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Failed to fetch leave balance:', error);

      return {
        success: false,
        error: error.response?.data?.message || 'Something went wrong'
      };
    }
  }


  // Get pending requests count
  static async getPendingRequests() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: { count: 2 }
        });
      }, 500);
    });
  }

  // Get calendar events
  static async getCalendarEvents() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            { id: 1, title: 'Faculty Meeting', date: '2025-05-26', type: 'meeting' },
            { id: 2, title: 'Annual Leave', date: '2025-06-15', type: 'leave' },
            { id: 3, title: 'Conference', date: '2025-06-20', type: 'event' }
          ]
        });
      }, 500);
    });
  }

  // Get my applications
  // static async getMyApplications() {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve({
  //         success: true,
  //         data: [
  //           {
  //             id: 1,
  //             leaveType: LEAVE_TYPES.LWP,
  //             startDate: '2025-05-20',
  //             endDate: '2025-05-22',
  //             days: 3,
  //             reason: 'Personal work',
  //             status: LEAVE_STATUS.APPROVED,
  //             appliedDate: '2025-05-15',
  //             approvedBy: 'Dr. Smith'
  //           },
  //           {
  //             id: 2,
  //             leaveType: LEAVE_TYPES.SICK,
  //             startDate: '2025-05-10',
  //             endDate: '2025-05-12',
  //             days: 3,
  //             reason: 'Fever and cold',
  //             status: LEAVE_STATUS.PENDING,
  //             appliedDate: '2025-05-08',
  //             approvedBy: null
  //           },
  //           {
  //             id: 3,
  //             leaveType: LEAVE_TYPES.EARNED,
  //             startDate: '2025-04-15',
  //             endDate: '2025-04-20',
  //             days: 6,
  //             reason: 'Family vacation',
  //             status: LEAVE_STATUS.REJECTED,
  //             appliedDate: '2025-04-10',
  //             approvedBy: 'Dr. Johnson'
  //           }
  //         ]
  //       });
  //     }, 500);
  //   });
  // }

  static async getMyApplications() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/facultyroutes/leave-history', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Failed to fetch leave applications:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred while fetching leave data'
      };
    }
  }


  // Apply for leave
  // static async applyLeave(leaveData) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       // Basic validation
  //       if (!leaveData.leaveType || !leaveData.startDate || !leaveData.endDate || !leaveData.reason) {
  //         reject({
  //           success: false,
  //           message: 'All fields are required'
  //         });
  //         return;
  //       }

  //       resolve({
  //         success: true,
  //         message: 'Leave application submitted successfully',
  //         data: {
  //           id: Date.now(),
  //           ...leaveData,
  //           status: LEAVE_STATUS.PENDING,
  //           appliedDate: new Date().toISOString().split('T')[0]
  //         }
  //       });
  //     }, 1000);
  //   });
  // }

  static async applyLeave(leaveData) {
    try {
      // Basic validation
      if (!leaveData.leavetype || !leaveData.fromDate || !leaveData.toDate || !leaveData.reason) {
        return Promise.reject({
          success: false,
          message: 'All fields are required'
        });
      }

      const token = localStorage.getItem('token'); // make sure this returns a valid JWT

      const response = await axios.post(
        '/api/emergencyleave/apply',
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return {
        success: true,
        message: 'Leave application submitted successfully',
        data: response.data
      };
    } catch (error) {
      return Promise.reject({
        success: false,
        message: error.response?.data?.message || 'Something went wrong'
      });
    }
  }

  // Calculate days between dates
  static calculateLeaveDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return dayDiff > 0 ? dayDiff : 0;
  }
}

export default FacultyAPI;