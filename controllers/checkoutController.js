import { checkoutModel } from '../models/checkoutModel.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/errorHandler.js';

export const checkoutController = { 
    // POST /api/checkout  [Público - cliente inicia checkout]
    create: async (req, res) => { 
        try {
            const { plan_id, free_trial } = req.body;
            const stripeCustomer = req.stripeCustomer;

            if (!plan_id) {
                return sendErrorResponse(
                    res,
                    400,
                    'O campo plan_id é obrigatório.',
                    'VALIDATION_ERROR'
                );
            }

            if (free_trial !== undefined && (!Number.isInteger(free_trial) || free_trial <= 0)) {
                return sendErrorResponse(
                    res,
                    400,
                    'O campo free_trial deve ser um número inteiro positivo de dias.',
                    'VALIDATION_ERROR'
                );
            }

            const checkoutSession = await checkoutModel.create({
                stripeCustomer,
                plan_id,
                free_trial,
                success_url: `${process.env.CHECKOUT_SUCCESS_URL}`,
                cancel_url: `${process.env.CHECKOUT_CANCEL_URL}`,
            });

            return sendSuccessResponse(
                res,
                200,
                {
                    sessionId: checkoutSession.stripe_checkout_session_id,
                    url: checkoutSession.stripe_checkout_session.url,
                },
                'Sessão de checkout criada com sucesso'
            );
        } catch (error) {
            console.error('❌ Erro ao criar sessão de checkout:', error.message)
            return sendErrorResponse(
                res,
                500,
                'Erro ao criar sessão de checkout.',
                'SUBSCRIPTION_ERROR',
                { originalError: error.message }
            )
        }
    }
}