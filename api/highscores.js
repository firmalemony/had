const { put, get } = require('@vercel/blob');

const BLOB_KEY = 'highscores.json';

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const blob = await get(BLOB_KEY);
      const highscores = blob ? JSON.parse(await blob.text()) : [];
      res.status(200).json({ highscores });
    } catch (e) {
      res.status(200).json({ highscores: [] });
    }
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const { name, score } = JSON.parse(body);
        let highscores = [];
        try {
          const blob = await get(BLOB_KEY);
          highscores = blob ? JSON.parse(await blob.text()) : [];
        } catch (e) {}
        highscores.push({ name, score, date: new Date().toISOString() });
        highscores.sort((a, b) => b.score - a.score);
        highscores = highscores.slice(0, 10);
        await put(BLOB_KEY, JSON.stringify(highscores), { contentType: 'application/json' });
        res.status(200).json({ success: true });
      } catch (e) {
        res.status(400).json({ success: false, error: 'Invalid JSON' });
      }
    });
  }
} 