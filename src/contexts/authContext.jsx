import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [localStorage]);

  // Login function with robust data normalization
  const login = (data) => {
    if (!data) return;
    
    console.log('AuthContext: Processing login data:', data);

    // According to the console log, the structure is data.data.user
    // We try to find the most 'user-like' object in the response
    const userData = (data.data && data.data.user) || data.user || data.data || (data.email ? data : null);
    
    if (userData) {
      // Normalize common field names
      const normalizedUser = {
        ...userData,
        // Map ID correctly
        id: userData.id || userData._id || userData.userId || userData.facultyId || userData.uid,
        // Standardize role for the frontend's routing logic (e.g., 'FACULTY' -> 'faculty')
        role: (userData.role || userData.position || "").toLowerCase()
      };
      
      console.log('AuthContext: Normalized user object:', normalizedUser);
      setUser(normalizedUser);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    } else {
      console.error('AuthContext: Could not find user data in response:', data);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
