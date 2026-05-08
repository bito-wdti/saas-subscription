import { createCheckoutSession } from "../config/stripeHelpers.js";

export const checkoutModel = {
    data: [],

    async create(checkout) {
        try {
            const { stripeCustomer, plan_id, success_url, cancel_url } = checkout;

            // Criar sessão de checkout no Stripe
            const session = await createCheckoutSession(stripeCustomer, plan_id, success_url, cancel_url);

            // Salvar registro localmente
            const record = {
                id: this.data.length + 1,
                stripe_customer_id: stripeCustomer.id,
                plan_id,
                stripe_checkout_session_id: session.id,
                stripe_checkout_session: session,
                status: 'pending',
                created_at: new Date().toISOString(),
            };

            this.data.push(record);
            return record;

        } catch (error) {
            console.error('❌ Erro ao criar checkout no model:', error.message);
            throw error;
        }
    }
}