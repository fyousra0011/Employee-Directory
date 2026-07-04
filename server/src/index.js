const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const employeeRoutes = require('./routes/employees');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/employees', employeeRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Employee API is running' });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});