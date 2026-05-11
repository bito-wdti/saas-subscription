import { createStripeCustomer, findStripeCustomerByEmail } from '../config/stripeHelpers.js';
import { sendErrorResponse } from '../utils/errorHandler.js';

export const stripeCustomerMiddleware = async (req, res, next) => {
  try {
    const { email, customer_name } = req.body;

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

      if (!customer_name) {
        return sendErrorResponse(
          res,
          400,
          'O campo customer_name é obrigatório quando não existe um cliente na base de dados Stripe.',
          'VALIDATION_ERROR'
        );
      }

      const customerName = customer_name;
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
