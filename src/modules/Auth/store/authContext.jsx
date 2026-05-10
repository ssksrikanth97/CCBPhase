import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const MOCK_USERS = [
  { email: 'superadmin@evphase.com', password: 'admin123', role: 'superAdmin', name: 'Super Admin' },
  { email: 'productadmin@evphase.com', password: 'admin123', role: 'productAdmin', name: 'Product Admin' },
  { email: 'csr@evphase.com', password: 'admin123', role: 'csrAgent', name: 'CSR Agent' },
  { email: 'backoffice@evphase.com', password: 'admin123', role: 'backOfficeAdmin', name: 'Back Office Admin' },
];

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('isAuthenticated') === 'true'
  );
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(sessionStorage.getItem('currentUser') || 'null')
  );
  const [error, setError] = useState('');

  const login = useCallback((email, password) => {
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setError('');
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    setError('Invalid credentials. Select a user from the quick login dropdown below.');
    return null;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('currentUser');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
