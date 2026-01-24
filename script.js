document.addEventListener('DOMContentLoaded', () => {
    // ────────────────────────────────────────────────
    // Основні елементи
    const form = document.getElementById('telegramForm');
    const clearBtn = document.querySelector('.clear-btn');
    const themeToggle = document.getElementById('themeToggle');

    // ────────────────────────────────────────────────
    // Функція логування (можна прибрати пізніше)
    const logs = [];
    const addLog = (msg, data = {}) => {
        const entry = `${msg}: ${JSON.stringify(data)}`;
        logs.push(entry);
        console.log(entry);
    };

    // ────────────────────────────────────────────────
    // Очищення форми — найнадійніший варіант
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (!form) return;

            form.reset();  // це повинно зняти всі чекбокси та очистити текстові поля

            // Додаткова страховка (деякі браузери/WebView глючать)
            form.querySelectorAll('input[type="text"], input[type="url"]').forEach(el => {
                el.value = '';
            });

            // Прибираємо стан валідації браузера (червоні рамки)
            form.querySelectorAll(':invalid').forEach(el => el.setCustomValidity(''));

            addLog('Форма очищена');
            // clearBtn.textContent = 'ОЧИЩЕНО!';   // можна додати фідбек
            // setTimeout(() => clearBtn.textContent = 'CLEAR', 1000);
        });
    }

    // ────────────────────────────────────────────────
    // Перемикання теми (спрощено + виправлено)
    if (themeToggle) {
        // Завантаження збереженої теми
        const saved = localStorage.getItem('theme') || 'dark';
        document.body.classList.toggle('light-theme', saved === 'light');
        document.body.classList.toggle('dark-theme', saved !== 'light');
        themeToggle.checked = saved === 'light';

        // Обробник зміни
        themeToggle.addEventListener('change', () => {
            const isLight = themeToggle.checked;
            document.body.classList.toggle('light-theme', isLight);
            document.body.classList.toggle('dark-theme', !isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');

            // Оновлення активності іконок (якщо вони є)
            document.querySelector('.theme-label-moon')?.classList.toggle('active', !isLight);
            document.querySelector('.theme-label-sun')?.classList.toggle('active', isLight);

            addLog('Тема змінена', { theme: isLight ? 'light' : 'dark' });
        });
    }

    // ────────────────────────────────────────────────
    // Інші обробники, які ти поки хочеш залишити
    document.querySelector('.instruction-btn')?.addEventListener('click', () => {
        document.getElementById('instructions')?.scrollIntoView({ behavior: 'smooth' });
    });

    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('scroll', () => {
        const btn = document.querySelector('.scroll-top-btn');
        if (btn) btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    console.log("Скрипт завантажився");
});
