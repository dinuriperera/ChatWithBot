import axios from 'axios';

const API_URL = 'http://localhost:3001/api/inventory';

export const inventoryService = {
    // Get all inventory items
    getAllItems: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get a single item
    getItem: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create a new item
    createItem: async (itemData) => {
        try {
            const response = await axios.post(API_URL, itemData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update an item
    updateItem: async (id, itemData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, itemData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete an item
    deleteItem: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 