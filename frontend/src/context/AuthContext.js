import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Auth error:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          await fetchUser();
        } catch (error) {
          console.error('Failed to fetch user:', error);
          logout();
        }
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Clear any existing auth data
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);

      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { success, token, user: userData } = response.data;
      
      if (!success || !token || !userData) {
        console.error('Invalid server response:', response.data);
        throw new Error('Invalid response from server');
      }

      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update user state
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      
      // Clear any existing auth data
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);

      // Handle different types of errors
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      }
      
      throw new Error('Failed to login. Please check your credentials and try again.');
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      
      const { token, user: newUser } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to create account. Please check all required fields.');
    }
  };

  const updateUser = async (userData) => {
    try {
      // Update user in the backend
      const response = await axios.put('/api/auth/update-profile', userData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update profile');
      }

      // Get fresh user data from the backend
      const updatedUserResponse = await axios.get('/api/auth/me');
      const updatedUser = updatedUserResponse.data.data;

      // Update local state
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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