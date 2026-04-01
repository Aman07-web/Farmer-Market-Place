import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EscrowCheckout from '../components/EscrowCheckout';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const productId = searchParams.get('productId');
    const amount = parseFloat(searchParams.get('amount') || '0');
    const sellerId = searchParams.get('sellerId');
    const productName = searchParams.get('productName') || 'Farm Product';

    // Use real logged-in buyer ID
    const buyerId = user?.id;

    if (!buyerId) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-4xl mb-4">🔒</p>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Login Required</h2>
                        <p className="text-slate-500 mb-6">Please login to complete your purchase.</p>
                        <button onClick={() => navigate('/login')} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">
                            Login Now
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-[5%] max-w-[1200px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                    {/* Left: Order Summary */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-1">Step 1 of 1</p>
                            <h1 className="text-4xl font-black text-slate-900 font-playfair">Checkout</h1>
                            <p className="text-slate-500 text-sm mt-1">Review your order and complete secure payment</p>
                        </div>

                        {/* Order Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-widest mb-4">Your Order</h3>
                            <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl mb-4">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">🌾</div>
                                <div className="flex-1">
                                    <p className="font-black text-slate-900">{productName}</p>
                                    <p className="text-xs text-slate-400">Fresh from local farm · Direct delivery</p>
                                </div>
                                <p className="font-black text-emerald-700 text-lg">₹{amount}</p>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-slate-500 px-1">
                                    <span>Subtotal</span><span>₹{amount}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 px-1">
                                    <span>Delivery</span><span className="text-emerald-600 font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between font-black text-slate-900 text-base pt-3 border-t border-dashed border-slate-200 mt-2 px-1">
                                    <span>Total</span><span>₹{amount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Escrow Trust Badge */}
                        <div className="bg-emerald-600 text-white p-6 rounded-3xl">
                            <h4 className="font-black mb-3 flex items-center gap-2">
                                <span>🛡️</span> AgroConnect Escrow Protection
                            </h4>
                            <div className="space-y-2 text-sm text-emerald-100">
                                <p>✅ Money held safely until you confirm delivery</p>
                                <p>✅ Full refund if product not delivered in 2 days</p>
                                <p>✅ Razorpay encrypted · 100% secure</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment */}
                    <div className="lg:sticky lg:top-32">
                        <EscrowCheckout
                            productId={productId}
                            buyerId={buyerId}
                            sellerId={sellerId}
                            amount={amount}
                            productName={productName}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;
