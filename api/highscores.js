const { put, get } = require('@vercel/blob');
const { json } = require('micro');

const BLOB_KEY = 'highscores.json';

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const blob = await get(BLOB_KEY);
      const highscores = blob ? JSON.parse(await blob.text()) : [];
      return { highscores };
    } catch (e) {
      return { highscores: [] };
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, score } = await json(req);
      let highscores = [];
      try {
        const blob = await get(BLOB_KEY);
        highscores = blob ? JSON.parse(await blob.text()) : [];
      } catch (e) {}
      highscores.push({ name, score, date: new Date().toISOString() });
      highscores.sort((a, b) => b.score - a.score);
      highscores = highscores.slice(0, 10);
      await put(BLOB_KEY, JSON.stringify(highscores), { contentType: 'application/json' });
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Invalid JSON' };
    }
  }

  return { error: 'Method not allowed' };
}; 