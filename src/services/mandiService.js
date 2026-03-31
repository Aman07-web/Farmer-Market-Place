/**
 * Mandi Service - Fetches live daily Gov/Mandi prices (Agmarknet)
 * Resource ID: 35985678-0d79-46b4-9ed6-6f13308a1d24
 */

const API_BASE = "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24";
const API_KEY = import.meta.env.VITE_GOV_DATA_API_KEY;

export const mandiService = {
    /**
     * Fetches current mandi price for a specific crop (commodity)
     * Note: Indian Mandi prices are typically in Quintal (100kg)
     */
    async getPrice(commodityName) {
        if (!API_KEY) {
            console.warn("Mandi Price Error: VITE_GOV_DATA_API_KEY is missing in .env");
            return null;
        }

        try {
            // Search specifically for the commodity (Smart filtering)
            const url = `${API_BASE}?api-key=${API_KEY}&format=json&filters[commodity]=${encodeURIComponent(commodityName)}&limit=5`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (data.records && data.records.length > 0) {
                // Get the latest modal_price (Average price across markets for this crop today)
                const latest = data.records[0];
                return {
                    commodity: latest.commodity,
                    quintal_price: parseFloat(latest.modal_price), // Price per 100kg
                    kg_price: parseFloat(latest.modal_price) / 100, // Price per 1kg
                    last_updated: latest.arrival_date,
                    market: latest.market,
                    state: latest.state
                };
            }
            return null;
        } catch (error) {
            console.error("Mandi Price Fetch Error:", error);
            return null;
        }
    }
};
