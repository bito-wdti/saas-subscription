import 'dotenv/config'; 
import express from 'express';
import stripe from './config/stripe.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import productRoutes from './routes/productRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';

const app = express();

app.use(express.json());
const PORT = process.env.PORT
const API_NAME = process.env.API_NAME;

// Rotas
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ api: API_NAME, status: 'ok', timestamp: new Date().toISOString() })
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ ${API_NAME} Backend rodando em http://localhost:${PORT}`)
  console.log(`📋 Endpoints disponíveis:`)
  console.log(`   GET  /api/health`)
  console.log(`   GET  /api/products`)
  console.log(`   POST /api/subscriptions`)
  console.log(`   POST /api/checkout`)
});

export default app;

