import { createContext, useState, useContext } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    const login = async (credentials) => {
        const { data } = await api.post('/login', credentials);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);