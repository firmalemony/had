import { put, get } from '@vercel/blob';

const BLOB_KEY = 'highscores.json';

export default async function handler(req, res) {
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
    const { name, score } = req.body;
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
  }
} 