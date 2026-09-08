const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Переменные окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
    console.error('❌ BOT_TOKEN или CHAT_ID не заданы!');
    process.exit(1);
}

app.use(express.json());

// CORS — чтобы твой сайт мог отправлять запросы
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ===== ОТПРАВКА В TELEGRAM =====
app.post('/send', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Missing text' });
        }

        // Отправляем запрос в Telegram API
        const response = await axios({
            method: 'post',
            url: `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                chat_id: CHAT_ID,
                parse_mode: 'HTML',
                text: text,
            },
        });

        // Если Telegram ответил успешно
        if (response.status === 200 && response.data.ok) {
            res.json({ ok: true });
        } else {
            res.status(500).json({ error: 'Telegram API error' });
        }
    } catch (error) {
        console.error('Ошибка:', error.message);
        res.status(500).json({
            error: error.message,
            // Если есть подробности от Telegram, показываем их
            details: error.response ? error.response.data : null,
        });
    }
});

// ===== ПРОВЕРКА =====
app.get('/', (req, res) => {
    res.send('✅ PLTRS bot is running!');
});

app.get('/send', (req, res) => {
    res.send('✅ /send endpoint exists. Use POST to send messages.');
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
