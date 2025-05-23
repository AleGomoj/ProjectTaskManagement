const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { sequelize } = require('./models');

const userRoutes = require('./routes/userRoutes');
const boardRoutes = require('./routes/boardRoutes');
const googleRoutes = require('./routes/googleRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/google', googleRoutes);

app.get('/', (_req, res) => res.send('Task Management API Running!'));

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    try {
      await sequelize.authenticate();
      console.log('DB connected');
      await sequelize.sync();
      console.log(`Server running on port ${PORT}`);
    } catch (err) {
      console.error('Unable to connect to the database:', err);
    }
  });
}

module.exports = app;
