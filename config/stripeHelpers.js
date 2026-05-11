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
}

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
}

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
}

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
}

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
}

/**
 * Criar uma sessão de checkout no Stripe
 * @param {object} customer - Cliente no Stripe
 * @param {string} productId - ID do produto no Stripe
 * @param {string} successUrl - URL de sucesso após checkout
 * @param {string} cancelUrl - URL de cancelamento
 * @returns {Promise<object>} Sessão de checkout criada
 */
export const createCheckoutSession = async (customer, productId, successUrl, cancelUrl) => {
  try {
    // Buscar produto para obter o price_id
    const product = await getStripeProduct(productId);
    const priceId = product.default_price;

    if (!priceId) {
      throw new Error('Produto não possui default_price definido');
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Modo assinatura recorrente
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        product_id: productId,
        customer_email: customer.email,
        customer_name: customer.name,
      },
      allow_promotion_codes: true, // Permitir códigos de desconto
      billing_address_collection: 'required', // Coletar endereço de cobrança
      subscription_data: {
        metadata: {
          product_id: productId,
          customer_email: customer.email
        },
      },
    });

    return session;
  } catch (error) {
    console.error('❌ Erro ao criar sessão de checkout:', error.message);
    throw error;
  }
}
