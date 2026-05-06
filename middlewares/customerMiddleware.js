import { createStripeCustomer, findStripeCustomerByEmail, createPaymentMethod, setDefaultPaymentMethod } from '../config/stripeHelpers.js';
import { sendErrorResponse } from '../utils/errorHandler.js';

export const stripeCustomerMiddleware = async (req, res, next) => {
  try {
    const { email, customer_name, name, card_number, exp_month, exp_year, cvc } = req.body;

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

    // ─── Verificar e gerenciar método de pagamento ───────────────────────────────
    let paymentMethodInfo = null;

    // Verificar se já existe um default payment method ou default source
    const hasDefaultPaymentMethod = stripeCustomer.invoice_settings?.default_payment_method;
    const hasDefaultSource = stripeCustomer.default_source;

    if (hasDefaultPaymentMethod || hasDefaultSource) {
      // Cliente já possui um método de pagamento padrão
      paymentMethodInfo = {
        exists: true,
        default_payment_method: hasDefaultPaymentMethod,
        default_source: hasDefaultSource,
      };
      console.log('✅ Cliente já possui método de pagamento padrão');
    } else {
      // Cliente não possui método de pagamento, criar um novo
      if (!card_number || !exp_month || !exp_year || !cvc) {
        return sendErrorResponse(
          res,
          400,
          'Cliente não possui método de pagamento. Forneça os dados do cartão: card_number, exp_month, exp_year e cvc.',
          'PAYMENT_METHOD_REQUIRED'
        );
      }

      try {
        const newPaymentMethod = await createPaymentMethod(stripeCustomer.id, {
          card_number,
          exp_month,
          exp_year,
          cvc,
        });

        // Definir como default payment method
        await setDefaultPaymentMethod(stripeCustomer.id, newPaymentMethod.id);

        paymentMethodInfo = {
          exists: false,
          created: true,
          payment_method_id: newPaymentMethod.id,
          card_last4: newPaymentMethod.card.last4,
          card_brand: newPaymentMethod.card.brand,
        };
        console.log('✅ Novo método de pagamento criado e definido como padrão');
      } catch (cardError) {
        console.error('❌ Erro ao criar payment method:', cardError.message);
        return sendErrorResponse(
          res,
          400,
          'Erro ao processar dados do cartão. Verifique os dados fornecidos.',
          'PAYMENT_METHOD_ERROR',
          { details: cardError.message }
        );
      }
    }

    req.stripeCustomerPaymentInfo = paymentMethodInfo;
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