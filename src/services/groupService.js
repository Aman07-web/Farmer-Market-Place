import { supabase } from './supabase';

export const groupService = {
  // Create a new group buy
  async createGroupBuy(groupData) {
    const { data, error } = await supabase
      .from('group_buys')
      .insert([groupData]);
    
    if (error) throw error;
    return data;
  },

  // Get active group buys (e.g., near user)
  async getActiveGroupBuys() {
    const { data, error } = await supabase
      .from('group_buys')
      .select('*, products(*)')
      .eq('status', 'active');
    
    if (error) throw error;
    return data;
  },

  // Join a group buy
  async joinGroupBuy(groupBuyId, userId, quantity) {
    const { data, error } = await supabase
      .from('group_buy_participants')
      .insert([{
        group_buy_id: groupBuyId,
        user_id: userId,
        quantity: quantity
      }]);
    
    if (error) throw error;
    return data;
  },

  // Get participants for a group buy
  async getParticipants(groupBuyId) {
    const { data, error } = await supabase
      .from('group_buy_participants')
      .select('*, profiles(*)')
      .eq('group_buy_id', groupBuyId);
    
    if (error) throw error;
    return data;
  }
};
