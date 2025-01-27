const express = require('express');
const cors = require('cors');
const fs = require('fs');
const pool = require('./config/database');
const routes = require('./routes/routes')
const authRoutes = require('./routes/auth')
const path = require('path');
const schemaPath = path.resolve(__dirname, 'models', 'Schema.sql');

const app = express();
app.use(cors({
    origin : "*"
  }));
app.use(express.json());

const PORT = process.env.PORT || 4000

const initializeDatabase = async () => {
    try {
        pool.getConnection().then(() => {
            console.log('Connected to the MySQL database!');
        }).catch((err) => {
            console.error('Error connecting to the database:', err);
        });
        try {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            const queries = schema.split(';').filter(query => query.trim());
            for (const query of queries) {
                await pool.query(query);
            }
        } catch (error) {
            console.error('Error executing schema:', error.message);
        }
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit the process if the connection fails
    }
};

const startServer = async () => {
    await initializeDatabase(); // Ensure the database is connected
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();

app.use('/api', authRoutes)
app.use('/api', routes)


