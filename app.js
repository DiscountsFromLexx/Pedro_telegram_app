document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('telegramForm');
    const instructionBtn = document.querySelector('.instruction-btn');
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    const anonymousCheckbox = document.getElementById('anonymous');
    const customNameGroup = document.getElementById('customNameGroup');
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.querySelector('.theme-label');

    // Масив для збору логів
    const logs = [];

    
