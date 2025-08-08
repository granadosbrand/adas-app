/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./presentation/**/*.{js,jsx,ts,tsx}"
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
        primary: {
          50:  '#f1f3fc',
          100: '#e5eafa',
          200: '#d0d7f5',
          300: '#b3bdee',
          400: '#949be5',
          500: '#7a7bda',
          600: '#615aca', // principal
          700: '#584fb3',
          800: '#474291',
          900: '#3d3b74',
          950: '#252343',
          DEFAULT: '#615ACA',
        },
        secondary: {
          50:  '#fff1f0',
          100: '#ffe3e0',
          200: '#ffcfc9',
          300: '#ffb2a9',
          400: '#ff998f',
          500: '#ff857f',
          600: '#e76c66',
          700: '#cc574f',
          800: '#a44341',
          900: '#843533',
          DEFAULT: '#FF857F',
        },
        accent: {
          50:  '#e6fcfb',
          100: '#c1f9f6',
          200: '#8ff0eb',
          300: '#4ecdc4',
          400: '#38b6ac',
          500: '#2c9a91',
          600: '#227f77',
          700: '#1a6761',
          800: '#154f4b',
          900: '#103e3b',
          DEFAULT: '#4ecdc4',
        },
        neutral: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          DEFAULT: '#6b7280',
        },
        success: {
          DEFAULT: '#22c55e',
          dark: '#15803d',
          light: '#bbf7d0',
        },
        error: {
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
          light: '#fecaca',
        },
        warning: {
          DEFAULT: '#facc15',
          dark: '#b45309',
          light: '#fef9c3',
        }
      },
    },
  },
  plugins: [],
}
