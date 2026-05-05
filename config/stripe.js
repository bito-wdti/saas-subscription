import Stripe from 'stripe';

// Inicializar cliente Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Versão da API do Stripe
});

// Verificar se as chaves estão configuradas
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('❌ STRIPE_SECRET_KEY não está configurada no arquivo .env');
}

if (!process.env.STRIPE_PUBLIC_KEY) {
  throw new Error('❌ STRIPE_PUBLIC_KEY não está configurada no arquivo .env');
}

console.log('✅ Stripe inicializado com sucesso');

export default stripe;