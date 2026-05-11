# API de integração com o Stripe para pagamentos recorrentes (~).

## Problema que resolve
Conecta SaaS com o sistema de pagamento Stripe para permitir que usuários consigam fazer inscrições recorrentes.

## Solução
Sistema que integre as duas plataformas.

## Escopo
A API irá receber os dados do cartão de crédito do usuário da plataforma, repassando os dados para verificação de pagamento que será realizada via Stripe. A API deve fornecer então se a transação foi concluída com sucesso, também deve ser capaz de permitir a opção da plataforma informar um período de testes fornecido para usuários.

O que a API deve ser capaz de fazer
- Receber dados de compra do usuário
- Enviar os dados de compra para a API do Stripe processar
- Retornar status da compra
- Ser capaz de receber tempo de 'free trial'

O que a API não deve ser capaz de fazer
- Não será possível modificar no banco de dados informações sobre o usuário
- Não irá armazenar nenhum dado de pagamento

## Endpoints

### POST - Checkout

Dados enviados
- Email 
- Nome do cliente (necessário caso o cliente não possua cadastro no Stripe)
- Id do plano Stripe
- Periodo 'freetrial'

Resposta esperada
- URL com link para o checkout via Stripe
- Redirecionamento para o link em caso de sucesso no pagamento, ou link de fracasso no pagamento