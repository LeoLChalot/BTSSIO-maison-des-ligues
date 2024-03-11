/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,jsx}',
    './src/components/**/**/*.{js,jsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    container: {
      center: true,
    },
  },
  plugins: [require('flowbite/plugin')],
}

