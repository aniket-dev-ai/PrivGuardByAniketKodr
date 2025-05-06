export default {
    darkMode: "class", // Enables class-based dark mode
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            backgroundImage: {
                'glass': 'linear-gradient(to right bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
            }
        },
    },
    plugins: [],
};
