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

    // Функція для додавання логу
    const addLog = (message, data) => {
        const log = `${message}: ${JSON.stringify(data)}`;
        logs.push(log);
        console.log(log); // Залишаємо console.log для локального дебагу
    };

    // Перемикання тем    
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        const isLightTheme = document.body.classList.contains('light-theme');
        document.querySelector('.theme-label-moon').classList.toggle('active', !isLightTheme);
        document.querySelector('.theme-label-sun').classList.toggle('active', isLightTheme);
        localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
        addLog('Theme Changed', { theme: localStorage.getItem('theme') });
    });
    
    // Завантаження збереженої теми
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeToggle.checked = true;
        document.querySelector('.theme-label-moon').classList.remove('active');
        document.querySelector('.theme-label-sun').classList.add('active');
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        themeToggle.checked = false;
        document.querySelector('.theme-label-moon').classList.add('active');
        document.querySelector('.theme-label-sun').classList.remove('active');
    }

    

    // Ініціалізація стану поля для імені
    customNameGroup.style.display = anonymousCheckbox.checked ? 'block' : 'none';
    addLog('Initial Anonymous Checkbox State', { checked: anonymousCheckbox.checked });

    // Обробка кліку на кнопку "Інструкції"
    instructionBtn.addEventListener('click', () => {
        document.getElementById('instructions').scrollIntoView({ behavior: 'smooth' });
        addLog('Instruction Button Clicked', { action: 'scroll to instructions' });
    });

    // Показ/приховування кнопки "Вгору"
    window.addEventListener('scroll', () => {
        scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        addLog('Scroll Event', { scrollY: window.scrollY });
    });

    // Функція для прокрутки наверх
    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        addLog('Scroll to top', { action: 'scroll to top' });
    };

    // Показ/приховування поля для власного імені
    anonymousCheckbox.addEventListener('change', (e) => {
        customNameGroup.style.display = e.target.checked ? 'block' : 'none';
        addLog('Anonymous Checkbox Changed', { state: e.target.checked });
    });

        // Очищення форми
    document.querySelector('.clear-btn').addEventListener('click', () => {
        const form = document.getElementById('telegramForm');

        // Найнадійніший спосіб — спочатку reset(), потім примусово чистимо
        form.reset();

        // Додатково очищаємо текстові поля (на випадок, якщо reset() не спрацював)
        form.querySelectorAll('input[type="text"]').forEach(input => {
            input.value = '';
        });

        // Прибираємо можливі стани валідації браузера
        form.querySelectorAll('input:invalid, textarea:invalid').forEach(el => {
            el.setCustomValidity('');
        });

        addLog('Form Cleared', { action: 'form reset + manual clear' });
    });

    // Закриття клавіатури при кліку поза полями
    document.addEventListener('click', (e) => {
        if (!e.target.matches('input')) {
            document.activeElement?.blur();
            addLog('Click Outside Input', { action: 'hide keyboard' });
        }
    });

});   //  ← це остання дужка, яка закриває document.addEventListener('DOMContentLoaded', ...
