import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const ConfirmedOrders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchConfirmedOrders();
    }, [user]);

    const fetchConfirmedOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    product:products(*)
                `)
                .eq('buyer_id', user.id)
                .eq('status', 'confirmed')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-cream flex justify-center items-center font-bold">Loading your confirmations...</div>;

    return (
        <div className="min-h-screen bg-cream font-dmsans p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <Link to="/buyer-dashboard" className="inline-flex items-center gap-2 text-green-deep font-bold mb-8 hover:text-amber transition-colors">
                    ← Back to Dashboard
                </Link>

                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cream-dark pb-6">
                    <div>
                        <h1 className="font-playfair text-4xl font-black text-green-deep">Confirmed Orders</h1>
                        <p className="text-gray-500 mt-2">These are the harvests that farmers have accepted and are preparing.</p>
                    </div>
                    <div className="mt-4 md:mt-0 bg-green-fresh text-white px-6 py-2 rounded-full font-black text-sm shadow-md">
                        {orders.length} ACTIVE CONFIRMATIONS
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-cream-dark hover:shadow-xl transition-all p-2">
                             <div className="h-40 bg-cream rounded-2xl overflow-hidden">
                                <img src={order.product?.image_url_1} className="w-full h-full object-cover" alt={order.product?.name} />
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-green-deep">{order.product?.name}</h3>
                                    <span className="text-[10px] font-black uppercase bg-green-fresh/10 text-green-fresh px-2 py-1 rounded-full">Confirmed</span>
                                </div>
                                <div className="mt-4 flex justify-between items-end border-t border-cream-dark pt-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order Date</p>
                                        <p className="text-sm font-bold text-green-deep">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-xl font-black text-green-deep">₹{order.total_price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && <div className="col-span-full py-20 text-center text-gray-400 italic">No confirmed orders found yet.</div>}
                </div>
            </div>
        </div>
    );
};

export default ConfirmedOrders;
