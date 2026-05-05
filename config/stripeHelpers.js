import stripe from '../config/stripe.js';

/**
 * Criar um cliente no Stripe
 * @param {string} email - Email do cliente
 * @param {string} name - Nome do cliente
 * @returns {Promise<object>} Cliente criado no Stripe
 */
export const createStripeCustomer = async (email, name) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        createdAt: new Date().toISOString(),
      },
    });
    return customer;
  } catch (error) {
    console.error('❌ Erro ao criar cliente no Stripe:', error.message);
    throw error;
  }
};

/**
 * Buscar cliente no Stripe por ID
 * @param {string} customerId - ID do cliente no Stripe
 * @returns {Promise<object>} Dados do cliente
 */
export const getStripeCustomer = async (customerId) => {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error('❌ Erro ao buscar cliente no Stripe:', error.message);
    throw error;
  }
};

/**
 * Buscar cliente no Stripe por email
 * @param {string} email - Email do cliente
 * @returns {Promise<object|null>} Cliente encontrado ou null se não existir
 */
export const findStripeCustomerByEmail = async (email) => {
  try {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    return customers.data.length > 0 ? customers.data[0] : null;
  } catch (error) {
    console.error('❌ Erro ao buscar cliente Stripe por email:', error.message);
    throw error;
  }
};

/**
 * Criar uma intenção de pagamento
 * @param {number} amount - Valor em centavos (ex: 2999 = $29.99)
 * @param {string} customerId - ID do cliente no Stripe
 * @param {string} currency - Moeda (padrão: 'usd')
 * @returns {Promise<object>} PaymentIntent criado
 */
export const createPaymentIntent = async (amount, customerId, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      metadata: {
        createdAt: new Date().toISOString(),
      },
    });
    return paymentIntent;
  } catch (error) {
    console.error('❌ Erro ao criar intenção de pagamento:', error.message);
    throw error;
  }
};

/**
 * Criar uma assinatura (subscription) no Stripe
 * @param {string} customerId - ID do cliente no Stripe
 * @param {string} priceId - ID do preço/plano no Stripe
 * @returns {Promise<object>} Subscription criada
 */
export const createSubscription = async (customerId, priceId) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });
    return subscription;
  } catch (error) {
    console.error('❌ Erro ao criar assinatura no Stripe:', error.message);
    throw error;
  }
};

/**
 * Cancelar uma assinatura
 * @param {string} subscriptionId - ID da assinatura
 * @returns {Promise<object>} Assinatura cancelada
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.del(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('❌ Erro ao cancelar assinatura:', error.message);
    throw error;
  }
};

/**
 * Buscar uma assinatura
 * @param {string} subscriptionId - ID da assinatura
 * @returns {Promise<object>} Dados da assinatura
 */
export const getSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('❌ Erro ao buscar assinatura:', error.message);
    throw error;
  }
};

/**
 * Atualizar método de pagamento da assinatura
 * @param {string} subscriptionId - ID da assinatura
 * @param {string} paymentMethodId - ID do método de pagamento
 * @returns {Promise<object>} Assinatura atualizada
 */
export const updateSubscriptionPaymentMethod = async (subscriptionId, paymentMethodId) => {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      default_payment_method: paymentMethodId,
    });
    return subscription;
  } catch (error) {
    console.error('❌ Erro ao atualizar método de pagamento:', error.message);
    throw error;
  }
};

/**
 * Construir webhook event do Stripe
 * @param {string} body - Corpo bruto da requisição
 * @param {string} sig - Assinatura do webhook (header sig)
 * @returns {object} Evento do Stripe validado
 */
export const constructWebhookEvent = (body, sig) => {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    console.error('❌ Erro ao validar webhook do Stripe:', error.message);
    throw error;
  }
};
