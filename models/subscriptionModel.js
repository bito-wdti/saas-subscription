import { createSubscription } from '../config/stripeHelpers.js';

export const SubscriptionModel = {
  data: [],

  async create(subscription) {
    try {
      const { stripe_customer_id, plan_id, customer_name, customer_email, payment_method } = subscription;

      if (!stripe_customer_id) {
        const error = new Error('stripe_customer_id é obrigatório');
        error.code = 'VALIDATION_ERROR';
        error.statusCode = 400;
        throw error;
      }

      if (!plan_id) {
        const error = new Error('plan_id é obrigatório');
        error.code = 'VALIDATION_ERROR';
        error.statusCode = 400;
        throw error;
      }

      // Criar assinatura recorrente no Stripe
      const stripeSubscription = await createSubscription(stripe_customer_id, plan_id);

      // Salvar registro localmente
      const record = {
        id: this.data.length + 1,
        customer_name,
        customer_email,
        plan_id,
        payment_method,
        stripe_customer_id,
        stripe_subscription_id: stripeSubscription.id,
        stripe_subscription: stripeSubscription,
        status: stripeSubscription.status,
        created_at: new Date().toISOString(),
      };

      this.data.push(record);
      return record;
    } catch (error) {
      console.error('❌ Erro ao criar subscription no model:', error.message);
      throw error;
    }
  },
};