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
 * Buscar produto no Stripe por ID
 * @param {string} productId - ID do produto no Stripe
 * @returns {Promise<object>} Dados do produto
 */
export const getStripeProduct = async (productId) => {
  try {
    const product = await stripe.products.retrieve(productId);
    return product;
  } catch (error) {
    console.error('❌ Erro ao buscar produto do Stripe:', error.message);
    throw error;
  }
};

/**
 * Criar uma assinatura (subscription) no Stripe
 * @param {string} customerId - ID do cliente no Stripe
 * @param {string} product_id - ID do produto no Stripe (para obter o default_price)
 * @returns {Promise<object>} Subscription criada
 */
export const createSubscription = async (customerId, product_id) => {
  try {
    // Buscar o produto para obter o default_price
    const product = await getStripeProduct(product_id);
    const priceId = product.default_price;

    if (!priceId) {
      throw new Error('Produto não possui default_price definido');
    }

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

/**
 * Listar produtos do Stripe
 * @param {number} limit - Número máximo de produtos a retornar (padrão: 10)
 * @returns {Promise<Array>} Lista de produtos
 */
export const listStripeProducts = async (limit = 10) => {
  try {
    const products = await stripe.products.list({
      limit,
    });
    return products.data;
  } catch (error) {
    console.error('❌ Erro ao listar produtos do Stripe:', error.message);
    throw error;
  }
};

/**
 * Criar um payment method de cartão para um cliente
 * @param {string} customerId - ID do cliente no Stripe
 * @param {object} cardData - Dados do cartão com: card_number, exp_month, exp_year, cvc
 * @returns {Promise<object>} Payment method criado
 */
export const createPaymentMethod = async (customerId, cardData) => {
  try {
    const { card_number, exp_month, exp_year, cvc } = cardData;

    if (!card_number || !exp_month || !exp_year || !cvc) {
      throw new Error('Dados do cartão incompletos: card_number, exp_month, exp_year e cvc são obrigatórios');
    }

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: card_number,
        exp_month: parseInt(exp_month),
        exp_year: parseInt(exp_year),
        cvc,
      },
    });

    // Anexar o payment method ao cliente
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customerId,
    });

    return paymentMethod;
  } catch (error) {
    console.error('❌ Erro ao criar payment method:', error.message);
    throw error;
  }
};

/**
 * Atualizar o default payment method de um cliente
 * @param {string} customerId - ID do cliente no Stripe
 * @param {string} paymentMethodId - ID do payment method
 * @returns {Promise<object>} Cliente atualizado
 */
export const setDefaultPaymentMethod = async (customerId, paymentMethodId) => {
  try {
    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    return customer;
  } catch (error) {
    console.error('❌ Erro ao definir default payment method:', error.message);
    throw error;
  }
};
