/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          // Orange in light mode
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        secondary: {
          // Amber/yellow in light mode
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
          // Dark mode specific colors
          primary: '#121212',
          secondary: '#1e1e1e',
          tertiary: '#2d2d2d',
        },
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'spin-slower': 'spin 15s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slower': 'ping 5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 10s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-down': 'pulseDown 3s infinite',
        'pulse-right': 'pulseRight 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'sparkle': 'sparkle 1s linear forwards',
        'sparkle-spin': 'sparkle-spin 1s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        pulseDown: {
          '0%, 100%': { transform: 'translateY(0)', opacity: 0 },
          '50%': { transform: 'translateY(100%)', opacity: 1 },
        },
        pulseRight: {
          '0%, 100%': { transform: 'translateX(0)', opacity: 0 },
          '50%': { transform: 'translateX(100%)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        sparkle: {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '50%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0)', opacity: 0 },
        },
        'sparkle-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
      },
      boxShadow: {
        'glow': '0 0 15px 5px rgba(var(--tw-shadow-color), 0.5)',
        'glow-lg': '0 0 25px 10px rgba(var(--tw-shadow-color), 0.5)',
        'glow-orange': '0 0 15px 5px rgba(249, 115, 22, 0.5)',
        'glow-amber': '0 0 15px 5px rgba(245, 158, 11, 0.5)',
        'glow-yellow': '0 0 15px 5px rgba(234, 179, 8, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
