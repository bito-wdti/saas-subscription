import { getActiveSubscription } from '../config/stripeHelpers.js';

export const subscriptionModel = {
    data: [],

    async list(customerId) {
        try {
            const subscription = await getActiveSubscription(customerId);

            if (!subscription) {
                return { hasActiveSubscription: false };
            }

            const item = subscription.items.data[0];
            const price = item.price;
            const product = price.product;

            return {
                hasActiveSubscription: true,
                subscription: {
                    id: subscription.id,
                    status: subscription.status,
                    currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                    trialEnd: subscription.trial_end
                        ? new Date(subscription.trial_end * 1000).toISOString()
                        : null,
                    plan: {
                        id: product.id,
                        name: product.name,
                        amount: price.unit_amount,
                        currency: price.currency,
                        interval: price.recurring?.interval,
                    },
                },
            };
        } catch (error) {
            console.error('❌ Erro ao listar assinatura no model:', error.message);
            throw error;
        }
    }
}
