/** @type {import('tailwindcss').Config} */

// Material Design 3 - Official Google Color Palette
// Source: https://m3.material.io/
const material3Colors = {
  // Primary (Purple - Official M3)
  primary: {
    10: '#FFFBFE',
    20: '#FCE4EC',
    25: '#F8DFE7',
    30: '#F5D9E3',
    35: '#F1CDD9',
    40: '#ECB8CF',
    50: '#E8B4CC',
    60: '#D593B9',
    70: '#C27BA5',
    80: '#B06A92',
    90: '#A1597A',
    95: '#954A6E',
    99: '#7C4961',
    100: '#6750A4',
  },

  // Secondary (Muted Purple - Official M3)
  secondary: {
    10: '#FFFBFE',
    20: '#FCE4EC',
    25: '#F8DFE7',
    30: '#F5D9E3',
    35: '#F1CDD9',
    40: '#ECB8CF',
    50: '#E8B4CC',
    60: '#D593B9',
    70: '#C27BA5',
    80: '#B06A92',
    90: '#A1597A',
    95: '#954A6E',
    99: '#7C4961',
    100: '#625B71',
  },

  // Tertiary (Rose - Official M3)
  tertiary: {
    10: '#FFFBFA',
    20: '#FCE4E8',
    25: '#F8DFE3',
    30: '#F5D9DF',
    35: '#F1CDDA',
    40: '#ECB8CF',
    50: '#E8B4CC',
    60: '#D593B9',
    70: '#C27BA5',
    80: '#B06A92',
    90: '#A1597A',
    95: '#954A6E',
    99: '#7C4961',
    100: '#7D5260',
  },

  // Error (Red - Official M3)
  error: {
    10: '#FFFBF9',
    20: '#FCDEC8',
    25: '#F9D3BF',
    30: '#F6C8B7',
    35: '#F3BDAF',
    40: '#EFB8B0',
    50: '#EBACAF',
    60: '#E59BA9',
    70: '#DE7FA1',
    80: '#D76A66',
    90: '#C72C2A',
    95: '#B42020',
    99: '#92000A',
    100: '#B3261E',
  },

  // Neutral (Gray - Official M3)
  neutral: {
    10: '#FFFBFE',
    20: '#F5F5F5',
    25: '#EFEFEF',
    30: '#E9E9E9',
    35: '#E3E3E3',
    40: '#DEDEDE',
    50: '#D9D9D9',
    60: '#B3B3B3',
    70: '#8D8D8D',
    80: '#666666',
    90: '#404040',
    95: '#212121',
    99: '#000000',
    100: '#1C1B1F',
  },

  // Surface (for backgrounds)
  surface: '#FFFBFE',
  surfaceDim: '#DED8E1',
  surfaceBright: '#FFFBFE',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F7F2FA',
  surfaceContainer: '#F3EEF6',
  surfaceContainerHigh: '#EDE7F0',
  surfaceContainerHighest: '#E8E3EB',

  // On variants (text colors)
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onTertiary: '#FFFFFF',
  onError: '#FFFFFF',
  onSurface: '#1C1B1F',
  onBackground: '#1C1B1F',

  // Container variants
  primaryContainer: '#EADDFF',
  secondaryContainer: '#E8DEF8',
  tertiaryContainer: '#FFD8E4',
  errorContainer: '#F9DEDC',

  // On container variants
  onPrimaryContainer: '#21005D',
  onSecondaryContainer: '#1D192B',
  onTertiaryContainer: '#31111D',
  onErrorContainer: '#410E0B',

  // Outline variants
  outline: '#79747E',
  outlineVariant: '#CAC7D0',
}

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Material 3 palette
        ...material3Colors,
      },

      // Apple Design System - Shadows
      boxShadow: {
        'apple-subtle': '0 4px 12px rgba(0,0,0,0.05)',
        'apple-card': '0 8px 24px rgba(0,0,0,0.06)',
        'apple-focus': '0 4px 12px rgba(59,130,246,0.1)',
        'apple-glow': '0 4px 12px rgba(37,99,235,0.3)',
        'apple-glow-blue': '0 6px 20px rgba(37,99,235,0.3)',
        'apple-glow-red': '0 4px 12px rgba(239,68,68,0.15)',
        'apple-glow-indigo': '0 4px 12px rgba(79,70,229,0.3)',
      },

      // Material 3 Typography Scale
      fontSize: {
        // Display
        'display-lg': ['57px', { lineHeight: '64px', letterSpacing: '-0.25px', fontWeight: '400' }],
        'display-md': ['45px', { lineHeight: '52px', letterSpacing: '0px', fontWeight: '400' }],
        'display-sm': ['36px', { lineHeight: '44px', letterSpacing: '0px', fontWeight: '400' }],

        // Headline
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '0px', fontWeight: '400' }],
        'headline-md': ['28px', { lineHeight: '36px', letterSpacing: '0px', fontWeight: '400' }],
        'headline-sm': ['24px', { lineHeight: '32px', letterSpacing: '0px', fontWeight: '400' }],

        // Title
        'title-lg': ['22px', { lineHeight: '28px', letterSpacing: '0px', fontWeight: '500' }],
        'title-md': ['16px', { lineHeight: '24px', letterSpacing: '0.15px', fontWeight: '500' }],
        'title-sm': ['14px', { lineHeight: '20px', letterSpacing: '0.10px', fontWeight: '500' }],

        // Body
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0.15px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', letterSpacing: '0.25px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.40px', fontWeight: '400' }],

        // Label
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.10px', fontWeight: '500' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.50px', fontWeight: '500' }],
        'label-sm': ['11px', { lineHeight: '16px', letterSpacing: '0.50px', fontWeight: '500' }],
      },

      // Animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'pop': 'pop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
