/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./presentation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'work-black': ['WorkSans-Black', 'sans-serif'],
        'work-light': ['WorkSans-Light', 'sans-serif'],
        'work-medium': ['WorkSans-Medium', 'sans-serif'],
      },
      colors: {
        // 🌊 Turquesa Sereno - Primary
        primary: {
          50:  '#E9F9FC',
          100: '#D2F3F9',
          200: '#A6E6F2',
          300: '#79DAEC',
          400: '#4DCEE5',
          500: '#20C2DF',
          600: '#1CA6C0', // principal
          700: '#168497',
          800: '#116574',
          900: '#0C4650',
          950: '#082E35',
          DEFAULT: '#1CA7C0',
          light: '#D2F3F9',
          dark: '#168497',
        },

        // 🌿 Verde Crecimiento - Secondary
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // principal
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#047857',
        },

        // ☀️ Ámbar Calidez - Tertiary
        tertiary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // principal
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
          DEFAULT: '#f59e0b',
          light: '#fde68a',
          dark: '#b45309',
        },

        // 🔮 Púrpura Introspección - Accent
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // principal
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
          DEFAULT: '#8b5cf6',
          light: '#ede9fe',
          dark: '#6d28d9',
        },

        // ⚫ Grises Empáticos - Neutrals
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280', // principal
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          DEFAULT: '#6b7280',
          light: '#f3f4f6',
          dark: '#374151',
        },

        // 🧩 Estados específicos de ADAS
        growth: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#d1fae5',
        },
        insight: {
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
          light: '#ede9fe',
        },
        warmth: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          light: '#fef3c7',
        },
        emergency: {
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
          light: '#fef2f2',
        },
      },
    },
  },
  plugins: [],
}
