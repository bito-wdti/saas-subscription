import { createPaymentMethod, setDefaultPaymentMethod } from '../config/stripeHelpers.js';
import { sendErrorResponse } from '../utils/errorHandler.js';

export const paymentMethodMiddleware = async (req, res, next) => {
  try {
    const { card_number, exp_month, exp_year, cvc } = req.body;

    // Validar se todos os dados do cartão foram informados
    if (!card_number || !exp_month || !exp_year || !cvc) {
      return sendErrorResponse(
        res,
        400,
        'Todos os dados do cartão são obrigatórios: card_number, exp_month, exp_year e cvc.',
        'PAYMENT_METHOD_VALIDATION_ERROR'
      );
    }

    // Validar se o cartão não expirou
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() retorna 0-11

    if (exp_year < currentYear || (exp_year === currentYear && exp_month < currentMonth)) {
      return sendErrorResponse(
        res,
        400,
        'O cartão informado está expirado.',
        'CARD_EXPIRED_ERROR'
      );
    }

    // Assumir que req.stripeCustomer já foi definido por um middleware anterior
    const stripeCustomer = req.stripeCustomer;
    if (!stripeCustomer) {
      return sendErrorResponse(
        res,
        400,
        'Cliente Stripe não encontrado. Execute o middleware de cliente primeiro.',
        'CUSTOMER_NOT_FOUND_ERROR'
      );
    }

    // Criar o método de pagamento
    const newPaymentMethod = await createPaymentMethod(stripeCustomer.id, {
      card_number,
      exp_month,
      exp_year,
      cvc,
    });

    // Definir como default payment method
    await setDefaultPaymentMethod(stripeCustomer.id, newPaymentMethod.id);

    // Adicionar informações ao req para uso posterior
    req.paymentMethodInfo = {
      payment_method_id: newPaymentMethod.id,
      card_last4: newPaymentMethod.card.last4,
      card_brand: newPaymentMethod.card.brand,
      exp_month,
      exp_year,
    };

    console.log('✅ Método de pagamento criado e definido como padrão');
    next();
  } catch (error) {
    console.error('❌ Erro no middleware de método de pagamento:', error.message);
    return sendErrorResponse(
      res,
      500,
      'Erro ao processar método de pagamento.',
      'PAYMENT_METHOD_ERROR',
      { originalError: error.message }
    );
  }
};