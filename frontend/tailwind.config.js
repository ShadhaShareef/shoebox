export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8fb',
          100: '#dbeff5',
          200: '#b9dceb',
          300: '#83bddb',
          400: '#4f96c4',
          500: '#2e7d9d',
          600: '#24647e',
          700: '#1b4c5f',
          800: '#163c4f',
          900: '#122f41'
        },
        accent: '#f08c4a',
        success: '#2e7d32',
        warning: '#f9a825',
        error: '#d32f2f',
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        }
      },
      boxShadow: {
        sm: '0 1px 4px rgba(17, 24, 39, 0.06)',
        md: '0 4px 12px rgba(17, 24, 39, 0.08)',
        lg: '0 8px 24px rgba(17, 24, 39, 0.12)'
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.75rem',
        lg: '1.25rem'
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
