import { ProductModel } from "../models/productModel.js";
import { sendErrorResponse, sendSuccessResponse } from '../utils/errorHandler.js';

export const ProductController = {
  // GET /api/products
  list: async (req, res) => {
    try {
      const { limit } = req.query;
      const products = await ProductModel.list(limit ? parseInt(limit) : 10);

      return sendSuccessResponse(
        res,
        200,
        products,
        'Produtos listados com sucesso'
      );
    } catch (error) {
      console.error('❌ Erro ao listar produtos:', error.message);
      return sendErrorResponse(
        res,
        500,
        'Erro ao listar produtos.',
        'PRODUCT_LIST_ERROR',
        error.message
      );
    }
  },
};