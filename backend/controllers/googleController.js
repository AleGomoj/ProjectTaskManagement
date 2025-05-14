const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'No credential provided' });
  try {
    // Verifica el token de Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub } = payload;
    if (!email) return res.status(400).json({ message: 'No email from Google' });

    // Busca o crea el usuario
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ name: name || email, email, password: sub }); // sub como password dummy
    }
    // Genera JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(401).json({ message: 'Google auth failed', error: err.message });
  }
};
