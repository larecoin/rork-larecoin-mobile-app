export type ThemeMode = 'light' | 'dark';

export const lightTheme = {
  background: '#F0F7FA',
  backgroundSecondary: '#E8F2F7',
  backgroundTertiary: '#D9EBF2',
  surface: '#FFFFFF',
  surfaceLight: '#F5FAFC',
  
  primary: '#D4AF37',
  primaryLight: '#E5C76B',
  primaryDark: '#B8962E',
  
  accent: '#00B88A',
  accentLight: '#33E5B8',
  
  success: '#00B88A',
  warning: '#E5A030',
  error: '#E05050',
  
  text: '#1A2A35',
  textSecondary: '#5A6A75',
  textTertiary: '#8A9AA5',
  
  border: '#D0E0E8',
  borderLight: '#E0EDF2',
  
  gradient: {
    primary: ['#D4AF37', '#B8962E'],
    accent: ['#00D9A5', '#00B88A'],
    dark: ['#E8F2F7', '#F0F7FA'],
  },
  
  cardGradient: ['rgba(255, 255, 255, 0.95)', 'rgba(240, 247, 250, 0.98)'],
};

export const darkTheme = {
  background: '#0A0A0F',
  backgroundSecondary: '#12121A',
  backgroundTertiary: '#1A1A25',
  surface: '#1E1E2A',
  surfaceLight: '#252535',
  
  primary: '#D4AF37',
  primaryLight: '#E5C76B',
  primaryDark: '#B8962E',
  
  accent: '#00D9A5',
  accentLight: '#33E5B8',
  
  success: '#00D9A5',
  warning: '#FFB347',
  error: '#FF6B6B',
  
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textTertiary: '#6A6A7A',
  
  border: '#2A2A3A',
  borderLight: '#3A3A4A',
  
  gradient: {
    primary: ['#D4AF37', '#B8962E'],
    accent: ['#00D9A5', '#00B88A'],
    dark: ['#1A1A25', '#0A0A0F'],
  },
  
  cardGradient: ['rgba(30, 30, 42, 0.8)', 'rgba(26, 26, 37, 0.9)'],
};

export default lightTheme;
