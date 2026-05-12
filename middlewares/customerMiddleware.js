import jwt from 'jsonwebtoken';
import { createStripeCustomer, findStripeCustomerByEmail } from '../config/stripeHelpers.js';
import { sendErrorResponse } from '../utils/errorHandler.js';

export const stripeCustomerMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendErrorResponse(
        res, 
        401,
        'Token JWT não fornecido.',
        'UNAUTHORIZED'
      );
    }

    const token = authHeader.split(' ')[1];
    const { user_email: email, user_name: customer_name } = jwt.verify(token, process.env.JWT_SECRET);

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
          'O campo user_name no JWT é obrigatório quando não existe um cliente na base de dados Stripe.',
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
