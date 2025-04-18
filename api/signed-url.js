const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  try {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    const body = JSON.parse(data);

    const phone = String(body.phone || '');
    const buffet = String(body.buffet || '');

    const payload = {
      agent_id: 'kmAc1lnAVj0AkFHbD58w',
      user: {
        name: buffet || 'Cliente Impull',
      },
      phone: phone.replace(/\D/g, '')
    };

    const secret = process.env.ELEVENLABS_SECRET || 'alexandre_topzeira';
    const token = jwt.sign(payload, secret, { expiresIn: '5m' });

    const signedUrl = `https://api.elevenlabs.io/v1/agents/${payload.agent_id}/talk?token=${token}`;

    res.status(200).json({ signedUrl });
  } catch (error) {
    console.error('[signed-url] ERRO:', error.message);
    res.status(500).json({ error: 'Erro interno na função signed-url' });
  }
};
