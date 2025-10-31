/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: [
        './App.tsx',
        './components/**/*.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                dark: {
                    background: '#0f172a',
                    surface: '#1e293b',
                    primary: '#f87171',
                    secondary: '#60a5fa',
                    success: '#4ade80',
                    danger: '#fca5a5',
                    text: '#f1f5f9',
                    textSecondary: '#94a5b8',
                    border: '#334155',
                },
            },
        },
    },
    plugins: [],
};
