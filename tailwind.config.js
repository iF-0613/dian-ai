/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'PingFang SC',
          'Microsoft YaHei',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 24px 80px rgba(58, 45, 33, 0.12)',
        card: '0 12px 34px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 20px 50px rgba(15, 23, 42, 0.10)',
        brand: '0 12px 28px rgba(4, 120, 87, 0.22)',
        'brand-lg': '0 18px 42px rgba(4, 120, 87, 0.28)',
      },
      colors: {
        app: {
          bg: '#f6f8f6',
          surface: '#ffffff',
          border: '#e7e5e4',
          hover: '#f4f7f5',
        },
      },
    },
  },
  plugins: [],
};
