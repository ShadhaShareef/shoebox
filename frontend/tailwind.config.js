export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        paper: '#F8F7F3',
        accent: '#FF7A45',
        success: '#4C9F70',
        border: '#D9D7CF',
        muted: '#6B7280',
        surface: '#FFFFFF'
      },
      boxShadow: {
        level1: '0 1px 2px rgba(17, 24, 39, 0.05), 0 8px 24px rgba(17, 24, 39, 0.04)',
        level2: '0 6px 20px rgba(17, 24, 39, 0.10)',
        level3: '0 24px 80px rgba(17, 24, 39, 0.22)'
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem'
      },
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        6: '1.5rem',
        8: '2rem',
        12: '3rem',
        16: '4rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', 'Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
