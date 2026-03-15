export const LightColors = {
  saffron: '#FF6B00',
  white: '#FFFFFF',
  green: '#138808',
  deepBlue: '#1a237e',
  lightBlue: '#3498DB',
  red: '#E74C3C',
  purple: '#9B59B6',
  pink: '#E91E63',
  brown: '#795548',
  gold: '#FFD700',
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  textPrimary: '#1A1A2E',
  textSecondary: '#6C757D',
  textLight: '#ADB5BD',
  border: '#E9ECEF',
  gradientStart: '#FF6B00',
  gradientEnd: '#FF7700',
};

export const DarkColors = {
  ...LightColors,
  white: '#FFFFFF',
  background: '#0D1B2A',
  cardBackground: '#1B2B3B',
  surface: '#243447',
  textPrimary: '#FFFFFF',
  textSecondary: '#8899AA',
  border: '#2A3F55',
};

// Fallback for static imports (should be replaced by dynamic styles)
export const Colors = LightColors;
