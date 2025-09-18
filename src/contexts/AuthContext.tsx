import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  role: 'student' | 'faculty' | 'admin';
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: 'student' | 'faculty' | 'admin') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, expectedRole?: 'student' | 'faculty' | 'admin'): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Define credential sets
    const credentials = {
      student: { email: 'nirmal@123', password: '123' },
      faculty: { email: 'teacher@123', password: 'teacher123' },
      admin: { email: 'admin@123', password: 'admin123' }
    };

    // Check credentials based on expected role or all roles
    let authenticatedRole: 'student' | 'faculty' | 'admin' | null = null;

    if (expectedRole) {
      // Check specific role credentials
      const roleCredentials = credentials[expectedRole];
      if (email === roleCredentials.email && password === roleCredentials.password) {
        authenticatedRole = expectedRole;
      }
    } else {
      // Check all credentials (fallback for old login page)
      for (const [role, creds] of Object.entries(credentials)) {
        if (email === creds.email && password === creds.password) {
          authenticatedRole = role as 'student' | 'faculty' | 'admin';
          break;
        }
      }
    }

    if (authenticatedRole) {
      const userData: User = {
        email,
        role: authenticatedRole,
        name: authenticatedRole === 'student' ? 'Alex Johnson' : 
              authenticatedRole === 'faculty' ? 'Dr. Sarah Wilson' : 
              'Admin User'
      };

      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      return { success: true };
    } else {
      const roleText = expectedRole ? ` for ${expectedRole}` : '';
      return { 
        success: false, 
        error: `Invalid credentials${roleText}. Please check your email and password.` 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};