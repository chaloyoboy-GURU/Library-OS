import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(true);
    const toggleTheme = () => setIsDark(prev => !prev);

    const theme = {
        isDark,
        toggleTheme,
        colors: isDark ? {
            bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            cardBg: 'linear-gradient(145deg, #1e1e3a, #16213e)',
            cardBorder: 'rgba(212,175,55,0.2)',
            text: '#e0e0e0',
            textMuted: '#888',
            gold: '#d4af37',
            goldDim: 'rgba(212,175,55,0.15)',
            inputBg: 'rgba(255,255,255,0.05)',
            inputBorder: 'rgba(212,175,55,0.2)',
            navBg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            shadow: '0 8px 30px rgba(0,0,0,0.4)',
            rowEven: 'rgba(255,255,255,0.03)',
            rowOdd: 'rgba(255,255,255,0.06)',
        } : {
            bg: 'linear-gradient(135deg, #f5f0e8 0%, #ede8dc 100%)',
            cardBg: 'linear-gradient(145deg, #ffffff, #faf6ee)',
            cardBorder: 'rgba(139,109,56,0.25)',
            text: '#2a2a2a',
            textMuted: '#666',
            gold: '#8b6d38',
            goldDim: 'rgba(139,109,56,0.1)',
            inputBg: 'rgba(0,0,0,0.03)',
            inputBorder: 'rgba(139,109,56,0.3)',
            navBg: 'linear-gradient(135deg, #2c2c4e 0%, #1e3a5f 100%)',
            shadow: '0 8px 30px rgba(0,0,0,0.12)',
            rowEven: 'rgba(0,0,0,0.02)',
            rowOdd: 'rgba(0,0,0,0.04)',
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);