require('dotenv').config();
const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const cron = require('node-cron');
const { autoRefundJob } = require('./services/escrowService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/escrow', orderRoutes);
app.use('/api/orders', orderRoutes); // Legacy support for farmer dashboard

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
});

// Start Cron Jab for Auto Refund (Every hour)
cron.schedule('0 * * * *', async () => {
    console.log('Running Auto Refund Job...');
    await autoRefundJob();
});

app.listen(PORT, () => {
    console.log(`\n✅ Escrow Backend running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/health\n`);
});
