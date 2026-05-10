export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email = '', password = '' } = req.body || {};
  const ae = process.env.ADMIN_EMAIL || 'chirag.mewara.18@gmail.com';
  const ap = process.env.ADMIN_PASSWORD || 'Spintly@Builder25';
  const vp = process.env.VIEWER_PASSWORD || '';
  if (email.trim() === ae && password === ap) return res.json({ ok: true, role: 'admin' });
  if (vp && password === vp) return res.json({ ok: true, role: 'viewer' });
  return res.json({ ok: false, msg: 'Invalid credentials. Contact chirag.mewara.18@gmail.com for access.' });
}
