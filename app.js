const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const cafeteriasRoutes = require('./routes/cafeteriasRoutes');

const app = express();
app.use(express.json());
app.use(express.static('.')); 

app.use('/api', authRoutes);
app.use('/api/cafeterias', cafeteriasRoutes);

if (process.env.NODE_ENV !== 'test') {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;