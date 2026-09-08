// ============================================================
//  PLTRS — TELEGRAM BOT WEBHOOK (Render.com)
// ============================================================

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Токен и Chat ID — потом заменишь на свои
const BOT_TOKEN = 'YOUR_BOT_TOKEN';
const CHAT_ID = 'YOUR_CHAT_ID';

app.use(express.json());

// ===== ОТПРАВКА В TELEGRAM =====
app.post('/send', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Missing text' });
        }

        const response = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    parse_mode: 'HTML',
                    text: text,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ error: data.description });
        }

        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== ПРОВЕРКА, ЧТО СЕРВЕР ЖИВ =====
app.get('/', (req, res) => {
    res.send('✅ PLTRS bot is running!');
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
