const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. Order Status Management (Critical for Inventory Sync)
app.post('/api/orders/update-status', async (req, res) => {
    const { orderId, farmerId, newStatus } = req.body;
    
    try {
        // Step A: Fetch Order and Product details
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, product:products(*)')
            .eq('id', orderId)
            .single();

        if (orderError) throw orderError;
        if (order.farmer_id !== farmerId) return res.status(403).json({ error: "Unauthorized access" });

        // Logic check: If approving ('confirmed'), reduce stock
        if (newStatus === 'confirmed' && order.status === 'pending') {
            const orderQtyKg = order.unit_at_order === 'quintal' ? (order.quantity * 100) : order.quantity;
            const currentStock = order.product.quantity;

            if (currentStock < orderQtyKg) {
                return res.status(400).json({ error: `🚨 Not Enough Stock: Farmer only has ${currentStock} KG.` });
            }

            // 1. Reduce Stock in Products table
            const { error: stockError } = await supabase
                .from('products')
                .update({ quantity: currentStock - orderQtyKg })
                .eq('id', order.product_id);

            if (stockError) throw stockError;
        }

        // 2. Update Order Status
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)
            .select('*');

        if (updateError) throw updateError;

        res.json({ 
            success: true, 
            message: `Order status updated to ${newStatus}`, 
            order: updatedOrder[0] 
        });
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Aggregated Farmer Dashboard Stats (Optimized Query)
app.get('/api/farmer/:id/analytics', async (req, res) => {
    const { id } = req.params;
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('farmer_id', id);

        if (error) throw error;

        // Calculate business insights
        const deliveredOrders = orders.filter(o => o.status === 'delivered');
        const totalSales = deliveredOrders.reduce((acc, o) => acc + o.total_price, 0);
        const aov = deliveredOrders.length > 0 ? (totalSales / deliveredOrders.length) : 0;
        const lostRate = (orders.filter(o => o.status === 'declined').length / (orders.length || 1)) * 100;

        res.json({ 
            revenue: totalSales, 
            avgOrderValue: Math.round(aov), 
            totalTransactions: deliveredOrders.length,
            lostOpportunityRate: Math.round(lostRate)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Health Check
app.get('/api', (req, res) => {
    res.json({ 
        name: "AgroConnect-Engine", 
        version: "1.0.0", 
        status: "Running 🚜",
        environment: process.env.NODE_ENV || 'development'
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 AgroConnect API is fully functional on http://localhost:${PORT}`);
    console.log(`📡 Access Health Check: http://localhost:${PORT}/api\n`);
});
