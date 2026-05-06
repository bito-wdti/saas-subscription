import { listStripeProducts } from '../config/stripeHelpers.js';

export const ProductModel = {
  async list(limit = 10) {
    try {
      const products = await listStripeProducts(limit);
      return products;
    } catch (error) {
      console.error('❌ Erro ao listar produtos no model:', error.message);
      throw error;
    }
  },
};