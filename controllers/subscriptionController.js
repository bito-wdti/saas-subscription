import { SubscriptionModel } from "../models/subscriptionModel.js"
import { sendErrorResponse, sendSuccessResponse } from '../utils/errorHandler.js';

export const SubscriptionController = {
    // POST /api/subscriptions  [Público - cliente finaliza assinatura]
    create: async (req, res) => {
        try {
            const { customer_name, customer_email, product_id, payment_method } = req.body
            const stripeCustomer = req.stripeCustomer

            if (!stripeCustomer) {
                return sendErrorResponse(
                    res,
                    400,
                    'Stripe customer não encontrado.',
                    'VALIDATION_ERROR'
                )
            }

            if (!product_id) {
                return sendErrorResponse(
                    res,
                    400,
                    'O campo product_id é obrigatório.',
                    'VALIDATION_ERROR'
                )
            }

            const subscription = await SubscriptionModel.create({
                customer_name,
                customer_email,
                product_id,
                payment_method,
                stripe_customer_id: stripeCustomer.id,
                stripe_customer: stripeCustomer,
            })

            return sendSuccessResponse(
                res,
                201,
                subscription,
                'Assinatura criada com sucesso'
            )
        } catch (error) {
            console.error('❌ Erro ao criar assinatura:', error.message)
            return sendErrorResponse(
                res,
                500,
                'Erro ao criar assinatura.',
                'SUBSCRIPTION_ERROR',
                { originalError: error.message }
            )
        }
    }
}