import { supabase } from './supabase';

export const orderService = {
  // Create a new order
  async createOrder(order) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order]);
    
    if (error) throw error;
    return data;
  },

  // Get orders for a specific user (either as a buyer or farmer)
  async getOrders(userId, role) {
    const field = role === 'farmer' ? 'farmer_id' : 'buyer_id';
    const { data, error } = await supabase
      .from('orders')
      .select('*, products(*)')
      .eq(field, userId);
    
    if (error) throw error;
    return data;
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) throw error;
    return data;
  },

  // Get a single order detail
  async getOrderById(id) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, products(*), profiles:buyer_id(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};
