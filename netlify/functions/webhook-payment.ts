import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Inicializar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Logger para debug
const log = (message: string, data?: any) => {
  console.log(`[${new Date().toISOString()}] ${message}`, data || '');
};

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Webhook-Token, Authorization',
    'Content-Type': 'application/json',
  };

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: 'OK',
    };
  }

  if (event.httpMethod === 'GET') {
    log('📍 GET /api/webhooks/payment - Health check');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Webhook de Pagamentos GATHO',
        endpoint: 'POST https://gatho.netlify.app/.netlify/functions/webhook-payment',
        status: 'Ativo - Aguardando evento de teste',
        auth: 'X-Webhook-Token ou Authorization header',
        timestamp: new Date().toISOString()
      }),
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      log('='.repeat(80));
      log('📨 Webhook de pagamento recebido');
      
      let body = {};
      if (event.body) {
        body = JSON.parse(event.body);
        log('Body:', JSON.stringify(body, null, 2));
      }
      
      log('Headers:', JSON.stringify(event.headers, null, 2));
      log('Query params:', event.queryStringParameters);
      log('='.repeat(80));

      // Validar token
      const token = 
        event.headers.authorization?.replace('Bearer ', '') ||
        event.headers['x-webhook-token'] ||
        event.queryStringParameters?.token;

      log('Token recebido:', token ? '✓ Presente' : '✗ Ausente');

      if (!token) {
        log('❌ Token não fornecido');
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Token inválido ou não fornecido',
            received_at: new Date().toISOString(),
          }),
        };
      }

      // Confirmar recebimento
      log('✓ Webhook processado com sucesso');
      log('='.repeat(80));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Webhook recebido com sucesso. Estrutura analisada.',
          received_at: new Date().toISOString(),
          payload_received: body,
        }),
      };

    } catch (error) {
      log('❌ Erro:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Erro ao processar webhook',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
          received_at: new Date().toISOString(),
        }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Método não permitido' }),
  };
};
