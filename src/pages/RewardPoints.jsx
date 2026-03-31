import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const RewardPoints = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRewards();
  }, [user]);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      // For now, we derive rewards from confirmed/delivered orders
      const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            product:products(name)
        `)
        .eq('buyer_id', user.id)
        .in('status', ['confirmed', 'delivered'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Logic: 10 points per order + 1 point for every ₹100 spent
      const processedRewards = data.map(order => ({
        id: order.id,
        activity: `Purchase: ${order.product?.name}`,
        points: 10 + Math.floor(order.total_price / 100),
        date: order.created_at,
        type: 'Order Achievement'
      }));

      setRewards(processedRewards);
      setTotalPoints(processedRewards.reduce((acc, curr) => acc + curr.points, 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-cream flex justify-center items-center font-bold">Unlocking your rewards...</div>;

  return (
    <div className="min-h-screen bg-cream font-dmsans p-6 md:p-12 relative overflow-hidden">
      {/* Background Sparkles */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-amber blur-[60px] opacity-20 rounded-full animate-pulse" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/buyer-dashboard" className="inline-flex items-center gap-2 text-green-deep font-bold mb-8 hover:text-amber transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
        </Link>
        
        <header className="bg-green-deep p-10 rounded-[40px] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl mb-12">
            <div>
                <h1 className="font-playfair text-4xl font-black mb-2">My Rewards Cabinet ✨</h1>
                <p className="opacity-70 text-sm">Harvesting points for every fresh purchase you make.</p>
            </div>
            <div className="bg-amber p-6 rounded-[32px] text-center min-w-[200px] shadow-lg border-4 border-white/20">
                <p className="text-[10px] font-black uppercase text-green-deep/60 tracking-widest mb-1">Total Balance</p>
                <h2 className="text-5xl font-black text-green-deep">{totalPoints}</h2>
                <p className="text-xs font-bold text-green-deep/80 mt-1">Reward Points</p>
            </div>
        </header>

        <section className="bg-white rounded-[32px] p-8 shadow-sm border border-cream-dark">
            <h3 className="font-playfair text-xl font-bold text-green-deep mb-8">Points Lore (History)</h3>
            <div className="space-y-6">
                {rewards.map(reward => (
                    <div key={reward.id} className="flex items-center justify-between p-5 bg-cream/20 rounded-2xl border border-cream-dark/50 hover:border-amber transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl shadow-sm border border-cream-dark group-hover:scale-110 transition-transform">💎</div>
                            <div>
                                <p className="text-sm font-bold text-green-deep">{reward.activity}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(reward.date).toLocaleDateString()} • {reward.type}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-black text-amber">+{reward.points}</p>
                            <p className="text-[10px] text-green-mid uppercase font-black">Earned</p>
                        </div>
                    </div>
                ))}
                {rewards.length === 0 && <div className="py-20 text-center text-gray-400 italic">Your reward cabinet is empty. Keep ordering fresh harvest to earn points!</div>}
            </div>
        </section>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
            <div className="bg-white p-6 rounded-3xl border border-cream-dark border-dashed">
                <p className="font-bold text-green-deep">Next Milestone: 500 Points</p>
                <div className="w-full bg-cream rounded-full h-2 mt-4 overflow-hidden">
                    <div className="bg-amber h-full rounded-full" style={{ width: `${(totalPoints/500)*100}%` }}></div>
                </div>
                <p className="text-[10px] mt-2 font-black uppercase text-gray-400 italic">Unlock "Bronze Sprouter" Badge at 500</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RewardPoints;
