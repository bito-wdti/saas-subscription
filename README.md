# API de integração com o Stripe para pagamentos recorrentes (~).

## Problema que resolve
Conecta SaaS com o sistema de pagamento Stripe para permitir que usuários consigam fazer inscrições recorrentes.

## Solução
Sistema que integre as duas plataformas.

## Escopo
A API irá receber do usuário logado o chamado para realizar o pagamento de um plano de assinatura, a API irá redirecionar o usuário para uma sessão de checkout via Stripe onde ele irá inserir os dados do cartão de crédito, o Stripe armazenará os dados para pagamento recorrente do usuário e a API irá redirecionar o usuário para uma URL de 'compra concluída' ou de 'problema no pagamento'.

O que a API deve ser capaz de fazer
- Receber dados do usuário através de token de autenticação
- Enviar esses dados e redirecionar o usuário para sessão de checkout via Stripe
- Retornar status da compra através das URLs
- Ser capaz de receber tempo de 'free trial'

O que a API não deve ser capaz de fazer
- Não será possível modificar no banco de dados informações sobre o usuário
- Não irá armazenar nenhum dado de pagamento

## Endpoints

### POST - Checkout

Dados enviados
- Token autenticado do usuário logado
- Id do plano Stripe
- Periodo 'freetrial'

Resposta esperada
- URL com link para o checkout via Stripe
- Redirecionamento para o link em caso de sucesso no pagamento, ou link de fracasso no pagamento