

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1e293b',    
          purple: '#4f46e5',  
          blue: '#e0f2fe',    
          pink: '#fce7f3',    
          mint: '#dcfce7',    
          peach: '#ffedd5',   
          lavender: '#f3e8ff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        script: ['Caveat', 'cursive'], 
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0, 0, 0, 0.04)',
        'soft-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.08)',
        'floating': '0 15px 35px -5px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '4xl': '2rem',   
        '5xl': '2.5rem', 
      }
    },
  },
  plugins: [],
  
}