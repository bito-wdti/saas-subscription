import { createStripeCustomer, findStripeCustomerByEmail, createPaymentMethod, setDefaultPaymentMethod } from '../config/stripeHelpers.js';
import { sendErrorResponse } from '../utils/errorHandler.js';

export const stripeCustomerMiddleware = async (req, res, next) => {
  try {
    const { email, customer_name, name } = req.body;

    if (!email) {
      return sendErrorResponse(
        res,
        400,
        'O campo email é obrigatório.',
        'VALIDATION_ERROR'
      );
    }

    let stripeCustomer = await findStripeCustomerByEmail(email);

    if (!stripeCustomer) {
      const customerName = customer_name || name || email;
      stripeCustomer = await createStripeCustomer(email, customerName);
    }

    req.stripeCustomer = stripeCustomer;
    next();
  } catch (error) {
    console.error('❌ Erro no middleware Stripe customer:', error.message);
    return sendErrorResponse(
      res,
      500,
      'Erro ao verificar ou criar cliente no Stripe.',
      'STRIPE_ERROR',
      { originalError: error.message }
    );
  }
};
