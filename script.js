document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('telegramForm');
    const submitBtn = document.querySelector('.submit-btn');
    const field4 = document.getElementById('field4');
    const resultText = document.getElementById('resultText');
    const clearBtn = document.querySelector('.clear-btn');
    const themeToggle = document.getElementById('themeToggle');

    // Логування
    const addLog = (msg, data = {}) => console.log(`${msg}:`, data);

    // ─── Логіка чекбокса ALL ────────────────────────────────────────
    const allCheckbox = document.getElementById('all');
    const otherCheckboxes = document.querySelectorAll('input[name="check"]:not(#all)');

    if (allCheckbox) {
        allCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            otherCheckboxes.forEach(cb => cb.checked = isChecked);
        });
    }

    otherCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const allChecked = Array.from(otherCheckboxes).every(c => c.checked);
            allCheckbox.checked = allChecked;
        });
    });

    // ─── Очищення форми ─────────────────────────────────────────────
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            form.reset();
            field4.value = '';
            resultText.innerHTML = '';
            addLog('Форма очищена');
        });
    }

    // ─── Перемикання теми ───────────────────────────────────────────
    if (themeToggle) {
        const saved = localStorage.getItem('theme') || 'dark';
        document.body.classList.toggle('light-theme', saved === 'light');
        document.body.classList.toggle('dark-theme', saved !== 'light');
        themeToggle.checked = saved === 'light';

        themeToggle.addEventListener('change', () => {
            const isLight = themeToggle.checked;
            document.body.classList.toggle('light-theme', isLight);
            document.body.classList.toggle('dark-theme', !isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');

            document.querySelector('.theme-label-moon')?.classList.toggle('active', !isLight);
            document.querySelector('.theme-label-sun')?.classList.toggle('active', isLight);
            addLog('Тема змінена', { theme: isLight ? 'light' : 'dark' });
        });
    }

    // ─── Кнопка "Вставити з буфера" ─────────────────────────────────
    pasteBtn.addEventListener('click', async () => {
    // Вібрація на iOS (працює тільки якщо дозволено)
    if (navigator.vibrate) navigator.vibrate(50);
    // ... решта коду
});
    const pasteBtn = document.getElementById('pasteBtn');
    if (pasteBtn) {
        pasteBtn.addEventListener('click', async () => {
            // Спочатку фокусуємо поле — це найважливіше для iOS
            field4.focus();
    
            try {
                const text = await navigator.clipboard.readText();
                const trimmed = text.trim();
                if (trimmed && (trimmed.includes('aliexpress.com') || trimmed.includes('s.click.aliexpress.com'))) {
                    field4.value = trimmed;
                    field4.select(); // виділяє весь текст
                    field4.focus();
                    resultText.innerHTML = 'Посилання вставлено!<br>Тепер натисніть START';
                    resultText.style.color = '#00ff88';
                } else {
                    resultText.innerHTML = 'У буфері немає валідного посилання з AliExpress';
                    resultText.style.color = 'orange';
                }
            } catch (err) {
                // На iOS показуємо інструкцію з емодзі та жирним текстом
                resultText.innerHTML = '<b>На iOS потрібно вставити вручну:</b><br>1. Натисніть довго на поле нижче<br>2. Оберіть «Вставити» у панелі, що з’явилася<br>3. Потім натисніть INSERT AND START';
                resultText.style.color = '#ffcc00'; // жовтий для уваги
            }
        });
    }
    // ─── Функція відправки форми (використовується і з кнопки, і з Enter) ──
    const sendForm = async () => {
        let link = field4.value.trim();

        // Якщо поле порожнє — беремо з буфера
        if (!link) {
            try {
                link = await navigator.clipboard.readText();
                link = link.trim();
                if (link && (link.includes('aliexpress.com') || link.includes('s.click.aliexpress.com'))) {
                    field4.value = link;
                    console.log('Автоматично вставлено з буфера:', link);
                } else {
                    resultText.innerHTML = 'У буфері немає посилання з AliExpress';
                    resultText.style.color = 'red';
                    return;
                }
            } catch (err) {
                resultText.innerHTML = 'Не вдалося прочитати буфер обміну.<br>Вставте посилання вручну.';
                resultText.style.color = 'red';
                return;
            }
        }

        // Перевірка валідності
        if (!link.includes('aliexpress.com') && !link.includes('s.click.aliexpress.com')) {
            resultText.innerHTML = 'Це не посилання AliExpress';
            resultText.style.color = 'red';
            return;
        }

        // Перед відправкою запиту
        submitBtn.disabled = true;
        submitBtn.textContent = 'Обробка...';
        resultText.innerHTML = '<span class="loading-text">Зачекайте...</span>';

        try {
            const response = await fetch('https://lexxexpress.click/pedro/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ link: link })
            });

            if (!response.ok) {
                throw new Error(`Помилка: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                let html = '';
                if (data.image_url) {
                    html += `<img src="${data.image_url}" alt="Товар" style="max-width: 90px; height: auto; border-radius: 12px; margin: 0 auto 12px; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">`;
                }
                html += data.result || 'Готово!';
                resultText.innerHTML = html;
                resultText.style.color = 'inherit'; // скидаємо колір на дефолтний
                field4.value = ''; // очищаємо поле вводу після успішної відправки
            } else {
                resultText.innerHTML = data.error || 'Помилка на сервері';
                resultText.style.color = 'red';
            }
        } catch (err) {
            resultText.innerHTML = 'Помилка з’єднання з сервером';
            resultText.style.color = 'red';
            console.error('Fetch error:', err);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'START';
        }
    };

    // ─── Обробка submit форми ────────────────────────────────────────
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await sendForm();
        });
    }

    // ─── Обробка кліку по кнопці (основний шлях) ─────────────────────
    if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await sendForm();
        });
    }

    // ─── Enter в полі field4 також відправляє ────────────────────────
    if (field4) {
        field4.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendForm();
            }
        });
    }

    // ─── Інші обробники ──────────────────────────────────────────────
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

    console.log("Скрипт Педро завантажився");
});
