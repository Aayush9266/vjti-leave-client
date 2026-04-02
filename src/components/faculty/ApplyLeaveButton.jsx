import React from 'react';
import { useNavigate } from 'react-router-dom';

const ApplyLeaveButton = () => {
  const navigate = useNavigate();

  return (
    <div className="m-8 space-x-4 flex flex-wrap gap-2 justify-center">
      
      <div
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#9d2235] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Apply for Leave :
      </div>

      <button
        onClick={() => navigate('/casual-leave-application')}
        className=" inline-flex items-center px-6 py-3 bg-[#9d2235] text-white rounded-md shadow-md hover:bg-red-700"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Casual Leave
      </button>
      <button
        onClick={() => navigate('/faculty/apply')}
        className="inline-flex items-center px-6 py-3 bg-[#9d2235] text-white rounded-md shadow-md hover:bg-red-700"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Emergency/Sick Leave
      </button>
      <button
        onClick={() => navigate('/leave-application')}
        className=" inline-flex items-center px-6 py-3 bg-[#9d2235] text-white rounded-md shadow-md hover:bg-red-700"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Special/Duty Leave
      </button>
    </div>
  );
};

export default ApplyLeaveButton;