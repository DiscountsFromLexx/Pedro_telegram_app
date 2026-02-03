document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('telegramForm');
    const submitBtn = document.querySelector('.submit-btn');
    const field4 = document.getElementById('field4');
    const field1 = document.getElementById('field1');
    const clearBtn = document.querySelector('.clear-btn');
    const themeToggle = document.getElementById('themeToggle');

    // Логування (можна прибрати)
    const logs = [];
    const addLog = (msg, data = {}) => {
        console.log(`${msg}:`, data);
        logs.push(`${msg}: ${JSON.stringify(data)}`);
    };

    // ─── Логіка чекбокса ALL ────────────────────────────────────────
    const allCheckbox   = document.getElementById('all');
    const otherCheckboxes = document.querySelectorAll('input[name="check"]:not(#all)');
    
    if (allCheckbox) {
        allCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            otherCheckboxes.forEach(cb => {
                cb.checked = isChecked;
            });
        });
    }
    
    // Додатково: якщо знімають будь-який інший → знімаємо ALL
    otherCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const allChecked = Array.from(otherCheckboxes).every(c => c.checked);
            allCheckbox.checked = allChecked;
        });
    });

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

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Спочатку намагаємося взяти посилання з буфера обміну
            let link = field4.value.trim();

            if (!link) {
                try {
                    link = await navigator.clipboard.readText();
                    link = link.trim();
                    if (link && (link.includes('aliexpress.com') || link.includes('s.click.aliexpress.com'))) {
                        field4.value = link;
                        addLog('Посилання автоматично взято з буфера обміну', { url: link });
                    } else {
                        field1.value = 'У буфері обміну немає посилання з AliExpress';
                        field1.style.color = 'red';
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'INSERT AND START';
                        return;
                    }
                } catch (err) {
                    field1.value = 'Не вдалося прочитати буфер обміну. Вставте посилання вручну.';
                    field1.style.color = 'red';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'INSERT AND START';
                    return;
                }
            }

            // Перевірка, чи посилання виглядає валідним
            if (!link.includes('aliexpress.com') && !link.includes('s.click.aliexpress.com')) {
                field1.value = 'Це не схоже на посилання AliExpress';
                field1.style.color = 'red';
                return;
            }

            // Блокуємо кнопку та показуємо статус
            submitBtn.disabled = true;
            submitBtn.textContent = 'Обробка...';
            field1.value = 'Зачекайте, йде обробка...';
            field1.style.color = 'inherit';

            try {
                const response = await fetch('https://lexxexpress.click/pedro/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ link: link })
                });

                const data = await response.json();

                if (data.success) {
                    field1.value = data.result || 'Готово! Результат отримано.';
                    field1.style.color = 'green';
                } else {
                    field1.value = data.error || 'Помилка обробки на сервері';
                    field1.style.color = 'red';
                }
            } catch (err) {
                field1.value = 'Помилка з’єднання з сервером';
                field1.style.color = 'red';
                console.error(err);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'INSERT AND START';
            }
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
