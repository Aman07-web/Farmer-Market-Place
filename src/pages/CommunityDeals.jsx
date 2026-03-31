import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const CommunityDeals = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    // Mock Data for "Nearby People" doing deals
    const [activeDeals, setActiveDeals] = useState([
        {
            id: 'deal-1',
            crop: 'Organic Basmati Rice',
            target: 200,
            reached: 145,
            price: 65,
            bulk_price: 48,
            members: [
                { name: 'Amit Sharma', qty: '20kg', role: 'Buyer' },
                { name: 'Rajesh K.', qty: '40kg', role: 'Buyer' },
                { name: 'Priya Verma', qty: '15kg', role: 'Buyer (Host)' },
                { name: 'Sunita M.', qty: '10kg', role: 'Buyer' },
            ]
        },
        {
            id: 'deal-2',
            crop: 'Premium Mustard Oil',
            target: 100,
            reached: 82,
            price: 180,
            bulk_price: 155,
            members: [
                { name: 'Yash (You)', qty: '10L', role: 'Buyer' },
                { name: 'Karan Singh', qty: '20L', role: 'Buyer' },
                { name: 'Sanjay Rawat', qty: '15L', role: 'Buyer' },
            ]
        }
    ]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Simulate real data fetching
        setTimeout(() => setLoading(false), 800);
    }, [user]);

    if (loading) return <div className="min-h-screen bg-cream flex justify-center items-center font-bold">Scanning local community deals...</div>;

    return (
        <div className="min-h-screen bg-cream font-dmsans p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <Link to="/buyer-dashboard" className="inline-flex items-center gap-2 text-green-deep font-bold mb-8 hover:text-amber transition-colors">
                    ← Back to Dashboard
                </Link>

                <header className="mb-12">
                    <h1 className="font-playfair text-4xl font-black text-green-deep mb-2">Community Deals 🤝</h1>
                    <p className="text-gray-500">Unlocking bulk field-pricing by combining orders with your neighborhood.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {activeDeals.map(deal => (
                        <div key={deal.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-cream-dark flex flex-col group hover:shadow-2xl transition-all">
                             <div className="bg-green-deep p-8 text-white relative">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Bulk Harvest Deal</p>
                                        <h2 className="text-2xl font-playfair font-black">{deal.crop}</h2>
                                    </div>
                                    <span className="bg-amber text-green-deep text-[10px] font-black px-3 py-1 rounded-full">ACTIVE</span>
                                </div>
                                <div className="flex gap-10">
                                    <div>
                                        <p className="text-sm font-black text-amber">₹{deal.bulk_price}/unit</p>
                                        <p className="text-[10px] opacity-60 font-bold uppercase">Community Price</p>
                                    </div>
                                    <div className="opacity-40">
                                        <p className="text-sm font-black line-through">₹{deal.price}/unit</p>
                                        <p className="text-[10px] font-bold uppercase">Standard Price</p>
                                    </div>
                                </div>
                                <div className="mt-8 bg-white/10 rounded-full h-2 overflow-hidden">
                                     <div className="bg-amber h-full rounded-full transition-all duration-1000" style={{ width: `${(deal.reached/deal.target)*100}%` }}></div>
                                </div>
                                <div className="mt-2 flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span>{deal.reached} units joined</span>
                                    <span>Goal: {deal.target} units</span>
                                </div>
                            </div>

                            <div className="p-8 flex-1">
                                <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">🤝 People joined with you</h3>
                                <div className="space-y-4">
                                    {deal.members.map((member, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-cream/20 rounded-xl border border-cream-dark/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white border border-cream-dark flex items-center justify-center text-xs font-bold text-green-deep uppercase shadow-sm">
                                                    {member.name.substring(0,2)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-green-deep">{member.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{member.role}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs font-black text-green-mid">Joined: {member.qty}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-10 bg-amber text-green-deep font-black py-4 rounded-2xl hover:bg-amber/80 transition-all shadow-lg text-sm">
                                    + Add More to this Group
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-amber/10 border-2 border-amber/20 border-dashed rounded-[40px] p-12 text-center">
                    <span className="text-4xl block mb-4">📍</span>
                    <h3 className="text-xl font-bold text-green-deep">Scan Nearby Harvests</h3>
                    <p className="text-sm text-gray-500 max-w-[400px] mx-auto mt-2">Connecting with farmers in UP, Punjab, and Maharashtra to find groups for you...</p>
                </div>
            </div>
        </div>
    );
};

export default CommunityDeals;
