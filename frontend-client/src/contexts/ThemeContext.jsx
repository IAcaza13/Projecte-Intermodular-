// src/contexts/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(
        () => localStorage.getItem('fleet-theme') || 'dark'
    );

    useEffect(() => {
        const root = document.documentElement;
        // Aplica la clase al <html> para que las variables CSS funcionen en toda la app
        if (theme === 'light') {
            root.classList.add('theme-light');
            root.classList.remove('theme-dark');
        } else {
            root.classList.add('theme-dark');
            root.classList.remove('theme-light');
        }
        localStorage.setItem('fleet-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);