/**
 * Formatar resposta de erro padrão RESTful
 * @param {string} message - Mensagem de erro
 * @param {string} code - Código de erro (ex: VALIDATION_ERROR, STRIPE_ERROR)
 * @param {object} details - Detalhes adicionais (opcional)
 * @returns {object} Objeto de erro formatado
 */
export const formatError = (message, code = 'INTERNAL_ERROR', details = null) => {
  const error = {
    success: false,
        error: {
        message,
        code,
    }
  };

  if (details) {
    error.error.details = details;
  }

  return error;
}

/**
 * Enviar resposta de erro HTTP
 * @param {object} res - Objeto Response do Express
 * @param {number} statusCode - Código HTTP (400, 500, etc)
 * @param {string} message - Mensagem de erro
 * @param {string} code - Código de erro
 * @param {object} details - Detalhes adicionais
 */
export const sendErrorResponse = (res, statusCode, message, code = 'INTERNAL_ERROR', details = null) => {
  return res.status(statusCode).json(formatError(message, code, details));
}

/**
 * Enviar resposta de sucesso
 * @param {object} res - Objeto Response do Express
 * @param {number} statusCode - Código HTTP (200, 201, etc)
 * @param {object} data - Dados da resposta
 * @param {string} message - Mensagem de sucesso (opcional)
 */
export const sendSuccessResponse = (res, statusCode, data, message = 'Operação realizada com sucesso') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
