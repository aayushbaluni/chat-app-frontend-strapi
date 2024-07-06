import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("jwtToken")?true:false);

  
  useEffect(()=>{
    if(localStorage.getItem("jwtToken"))setIsLoggedIn(true);
  },[window])
  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
    logout,
    setIsLoggedIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
