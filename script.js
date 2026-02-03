document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('telegramForm');
    const submitBtn = document.querySelector('.submit-btn');
    const field4 = document.getElementById('field4');
    const field1 = document.getElementById('field1');
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
            field1.value = '';
            field1.placeholder = "Тут буде магія...";
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

    // ─── Обробка натискання кнопки ──────────────────────────────────
    if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault(); // блокуємо стандартну відправку

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
                        field1.value = 'У буфері немає посилання з AliExpress';
                        field1.style.color = 'red';
                        return;
                    }
                } catch (err) {
                    field1.value = 'Не вдалося прочитати буфер обміну.\nВставте посилання вручну.';
                    field1.style.color = 'red';
                    return;
                }
            }

            // Перевірка валідності
            if (!link.includes('aliexpress.com') && !link.includes('s.click.aliexpress.com')) {
                field1.value = 'Це не посилання AliExpress';
                field1.style.color = 'red';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Обробка...';
            field1.value = 'Зачекайте...';
            field1.style.color = 'inherit';

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
                    field1.value = data.result || 'Готово!';
                    field1.style.color = 'green';
                } else {
                    field1.value = data.error || 'Помилка на сервері';
                    field1.style.color = 'red';
                }
            } catch (err) {
                field1.value = 'Помилка з’єднання з сервером';
                field1.style.color = 'red';
                console.error('Fetch error:', err);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'INSERT AND START';
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
