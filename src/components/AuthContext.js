import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    const isAdmin = auth && auth.username === 'admin'; // admin 확인 로직

    return (
        <AuthContext.Provider value={{ auth, setAuth, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
