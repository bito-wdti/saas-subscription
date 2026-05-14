import { subscriptionModel } from '../models/subscriptionModel.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/errorHandler.js';

export const subscriptionController = {
    // GET /api/subscription  [Público - cliente consulta sua assinatura]
    list: async (req, res) => {
        try {
            const stripeCustomer = req.stripeCustomer;

            const result = await subscriptionModel.list(stripeCustomer.id);

            return sendSuccessResponse(
                res,
                200,
                result,
                result.hasActiveSubscription
                    ? 'Assinatura ativa encontrada'
                    : 'Nenhuma assinatura ativa encontrada'
            );
        } catch (error) {
            console.error('❌ Erro ao buscar assinatura:', error.message);
            return sendErrorResponse(
                res,
                500,
                'Erro ao buscar assinatura.',
                'SUBSCRIPTION_ERROR',
                { originalError: error.message }
            );
        }
    }
}
