/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0e1012',
          900: '#141618',
          850: '#181b1e',
          800: '#1d2124',
          750: '#222629',
          700: '#282c30',
          600: '#323840',
          500: '#424a52',
          400: '#5c666f',
          300: '#7d8990',
          200: '#a8b3ba',
          100: '#cdd5da',
          50:  '#e8edef',
        },
        forest: {
          950: '#091a0d',
          900: '#0f2715',
          800: '#17381f',
          700: '#1f4a2b',
          600: '#275e35',
          500: '#2f7240',
          400: '#3d8f52',
          300: '#52a868',
          200: '#74c285',
          100: '#a5d9b2',
          50:  '#d4eeda',
        },
        amber: {
          950: '#2d1600',
          900: '#4a2400',
          800: '#6b3500',
          700: '#8e4800',
          600: '#b05c00',
          500: '#c97200',
          400: '#e08a1a',
          300: '#eda43a',
          200: '#f5be68',
          100: '#fad59a',
          50:  '#fdeecb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1)',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
