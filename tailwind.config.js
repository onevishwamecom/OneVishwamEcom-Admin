/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#4896E6',
          gold: '#EBBA44',
          orange: '#E47732',
          navy: '#0f1729',
          charcoal: '#1a1a2e',
          gray: '#f8fafc',
          steel: '#64748b',
          muted: '#f1f5f9',
          surface: '#0f172a',
          'surface-light': '#1e293b',
          'surface-lighter': '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(72, 150, 230, 0.15)',
        'glow-gold': '0 0 20px rgba(235, 186, 68, 0.15)',
        'glow-orange': '0 0 20px rgba(228, 119, 50, 0.15)',
        'glow-sm': '0 0 10px rgba(72, 150, 230, 0.1)',
        'elevated': '0 4px 24px -4px rgba(0, 0, 0, 0.08)',
        'elevated-lg': '0 8px 32px -8px rgba(0, 0, 0, 0.12)',
        'float': '0 12px 40px -12px rgba(0, 0, 0, 0.15)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'sidebar-gradient': 'linear-gradient(180deg, #0b1a33 0%, #0f2038 100%)',
        'hero-gradient': 'linear-gradient(135deg, #6BA5EC 0%, #4896E6 55%, #2F74C9 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(72,150,230,0.05) 0%, rgba(235,186,68,0.05) 100%)',
        'auth-gradient': 'linear-gradient(135deg, #6BA5EC 0%, #4896E6 55%, #2F74C9 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(72,150,230,0.05) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(235,186,68,0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(228,119,50,0.05) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'counter': 'counter 0.6s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(72, 150, 230, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(72, 150, 230, 0.4)' },
        },
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};