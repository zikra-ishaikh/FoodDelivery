import React, { createContext, useState, useEffect, useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';

// --- THEME DEFINITIONS ---
const THEMES: any = {
    Default: {
        name: 'Default',
        primary: '#6366F1', // Indigo
        primaryDark: '#4F46E5',
        secondary: '#EEF2FF',
        background: '#F9FAFB',
        cardBg: '#FFFFFF',
        text: '#111827',
        subtext: '#6B7280',
        accent: '#F59E0B', // Amber
        border: '#E5E7EB',
        bannerImage: null,
        banners: null,
        sticker: null,
        isDark: false
    },
    Diwali: {
        name: 'Diwali',
        primary: '#FFD700', // Gold (Buttons)
        primaryDark: '#B8860B',
        secondary: '#450a0a', // Deep Red (Accents)
        background: '#1a0505', // Very Dark Red/Black
        cardBg: '#2b0e0e', // Dark Red Card
        text: '#FFF5E1', // Cream/Gold White
        subtext: '#FCA5A5', // Light Red
        accent: '#FACC15',
        border: '#5c1c1c',
        bannerImage: 'https://b.zmtcdn.com/data/o2_assets/3e60223d6a07096e95c1a4e16c70757e1635848245.png',
        banners: [
            'https://img.freepik.com/free-vector/happy-diwali-sale-banner-with-discount-details_1017-29368.jpg',
            'https://img.freepik.com/free-vector/realistic-diwali-sale-horizontal-banner_23-2149725807.jpg',
            'https://img.freepik.com/free-vector/gradient-happy-diwali-horizontal-banner-template_23-2149669931.jpg'
        ],
        sticker: 'https://cdn-icons-png.flaticon.com/128/7406/7406606.png', // Diya Icon
        isDark: true
    },
    Christmas: {
        name: 'Christmas',
        primary: '#EF4444', // Red
        primaryDark: '#DC2626',
        secondary: '#FEF2F2',
        background: '#F0FDF4',
        cardBg: '#FFFFFF',
        text: '#064E3B',
        subtext: '#166534',
        accent: '#10B981',
        border: '#bbf7d0',
        bannerImage: 'https://img.freepik.com/free-vector/merry-christmas-banner-with-realistic-decoration_1017-29369.jpg',
        banners: null,
        sticker: 'https://cdn-icons-png.flaticon.com/128/623/623193.png', // Santa
        isDark: false
    },
    Eid: {
        name: 'Eid',
        primary: '#10B981', // Emerald
        primaryDark: '#059669',
        secondary: '#D1FAE5',
        background: '#ECFDF5',
        cardBg: '#FFFFFF',
        text: '#064E3B',
        subtext: '#047857',
        accent: '#F59E0B',
        border: '#6ee7b7',
        bannerImage: 'https://img.freepik.com/free-vector/gradient-eid-mubarak-banner-template_23-2149258273.jpg',
        banners: null,
        sticker: 'https://cdn-icons-png.flaticon.com/128/4253/4253264.png', // Moon
        isDark: false
    },
    Holi: {
        name: 'Holi',
        primary: '#EC4899', // Pink
        primaryDark: '#DB2777',
        secondary: '#FCE7F3',
        background: '#FFF1F2',
        cardBg: '#FFFFFF',
        text: '#831843',
        subtext: '#BE185D',
        accent: '#8B5CF6',
        border: '#fbcfe8',
        bannerImage: 'https://img.freepik.com/free-vector/gradient-holi-festival-sale-horizontal-banner_23-2149830589.jpg',
        banners: null,
        sticker: null,
        isDark: false
    },
    Independence: {
        name: 'Independence',
        primary: '#FF9933', // Saffron
        primaryDark: '#D47500',
        secondary: '#138808', // India Green
        background: '#0F172A', // Dark Navy (to make white text pop)
        cardBg: '#1E293B', // Slate 800
        text: '#F8FAFC', // White-ish
        subtext: '#94A3B8', // Slate 400
        accent: '#000080', // Navy Blue (Chakra)
        border: '#334155',
        bannerImage: 'https://img.freepik.com/free-vector/happy-independence-day-india-banner-design_1017-38685.jpg',
        banners: [
            'https://img.freepik.com/free-vector/flat-indian-independence-day-sale-banner-template_23-2149481977.jpg',
            'https://img.freepik.com/free-vector/gradient-independence-day-twitter-header_23-2149479632.jpg',
            'https://img.freepik.com/free-vector/indian-independence-day-banner-style_1017-38685.jpg'
        ],
        sticker: 'https://cdn-icons-png.flaticon.com/128/9406/9406567.png', // India Flag Heart
        isDark: true
    }
};

// --- CONTEXT ---
const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState(THEMES.Default);
    const [loading, setLoading] = useState(true);

    // ⚠️ YOUR IP HERE
    const API_URL = 'http://192.168.0.102:3000';

    const fetchTheme = async () => {
        try {
            console.log("Fetching theme...");
            const response = await fetch(`${API_URL}/current-theme`);
            const data = await response.json();
            console.log("Theme fetched:", data.theme);

            const themeConfig = THEMES[data.theme] || THEMES.Default;
            setTheme(themeConfig);
        } catch (error) {
            console.error("Failed to fetch theme", error);
            setTheme(THEMES.Default);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, refreshTheme: fetchTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
