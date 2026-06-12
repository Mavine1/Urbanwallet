import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        if (savedTheme === 'light') {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        } else {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'light') {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        } else {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
};