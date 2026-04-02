// src/components/PortalCard.jsx
import React from 'react';

const PortalCard = ({ title, description, icon, onClick, isComingSoon = false, gradient = 'from-red-700 to-red-800' }) => {
  return (
    <div 
      className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-500 overflow-hidden ${
        isComingSoon 
          ? 'opacity-70 cursor-not-allowed' 
          : 'hover:shadow-2xl hover:shadow-red-100/50 cursor-pointer transform hover:-translate-y-2 hover:scale-105'
      }`}
      onClick={!isComingSoon ? onClick : undefined}
    >
      {/* Background Gradient Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 ${!isComingSoon ? 'group-hover:opacity-5' : ''} transition-opacity duration-500`}></div>
      
      {/* Animated Border */}
      {!isComingSoon && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} blur-sm scale-105`}></div>
          <div className="absolute inset-0.5 bg-white rounded-2xl"></div>
        </div>
      )}
      
      <div className="relative z-10 text-center">
        {/* Icon with animated background */}
        <div className={`inline-block p-4 rounded-2xl mb-6 transition-all duration-500 ${
          isComingSoon 
            ? 'bg-gray-100' 
            : `bg-gradient-to-r from-red-700 to-red-800 group-hover:scale-110 group-hover:rotate-3`
        }`}>
          <div className={`text-4xl ${isComingSoon ? 'grayscale' : 'filter-none group-hover:scale-110'} transition-all duration-500`}>
            {icon}
          </div>
        </div>
        
        {/* Title with gradient text */}
        <h3 className={`text-2xl font-bold mb-3 transition-all duration-300 ${
          isComingSoon 
            ? 'text-gray-500' 
            : `text-gray-900 group-hover:bg-gradient-to-r group-hover:${gradient} group-hover:bg-clip-text group-hover:text-transparent`
        }`}>
          {title}
        </h3>
        
        {/* Description */}
        <p className={`text-base mb-6 leading-relaxed transition-colors duration-300 ${
          isComingSoon ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-700'
        }`}>
          {description}
        </p>
        
        {/* Action Button or Coming Soon Badge */}
        {isComingSoon ? (
          <div className="relative">
            <span className="inline-flex items-center gap-2 bg-gray-200 text-gray-500 px-6 py-3 rounded-xl text-sm font-semibold">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
              Coming Soon
            </span>
          </div>
        ) : (
          <button className={`group/btn bg-gradient-to-r from-red-700 to-red-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden`}>
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
            <span className="relative flex items-center justify-center gap-2">
              Access Portal
              <span className="text-lg group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </button>
        )}
      </div>
      
      {/* Floating particles effect for active cards */}
      {!isComingSoon && (
        <>
          <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-red-700 to-red-800 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-500" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-gradient-to-r from-red-700 to-red-800 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-500" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute bottom-8 left-4 w-1.5 h-1.5 bg-gradient-to-r from-red-700 to-red-800 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-500" style={{ animationDelay: '0.4s' }}></div>
        </>
      )}
    </div>
  );
};

export default PortalCard;