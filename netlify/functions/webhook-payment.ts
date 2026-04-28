import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Token de validação do webhook (preferir variável de ambiente)
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN || '84fqkth5';

// Inicializar Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      if (!supabaseUrl || !supabaseServiceKey) {
        log('❌ Variáveis do Supabase não configuradas', {
          SUPABASE_URL: supabaseUrl ? 'ok' : 'missing',
          SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'ok' : 'missing',
          SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'ok' : 'missing',
        });
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Configuração do Supabase ausente na função',
            received_at: new Date().toISOString(),
          }),
        };
      }

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

      // Validar token (pode vir no Header, na Query String ou no Body)
      const getHeader = (name: string) => {
        const key = Object.keys(event.headers || {}).find((k) => k.toLowerCase() === name.toLowerCase());
        return key ? event.headers[key] : undefined;
      };

      const authorization = getHeader('authorization');
      let receivedToken =
        authorization?.replace(/^Bearer\s+/i, '').trim() ||
        getHeader('x-webhook-token') ||
        event.queryStringParameters?.token;

      // Se não achar no header, procurar no body (muito comum em plataformas como PerfectPay, Kiwify, Ticto, Hotmart)
      if (!receivedToken && body) {
        const payload = body as any;
        receivedToken = payload.token || payload.webhook_token || payload.hottok || payload.signature;
      }

      log('Token recebido:', receivedToken ? '✓ Presente' : '✗ Ausente');

      if (!receivedToken) {
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

      // Validar token contra o valor esperado
      if (receivedToken !== WEBHOOK_TOKEN) {
        log(`❌ Token inválido. Esperado: ${WEBHOOK_TOKEN}, Recebido: ${receivedToken}`);
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Token inválido',
            received_at: new Date().toISOString(),
          }),
        };
      }

      log('✓ Token validado com sucesso');

      const payload = body as Record<string, any>;
      const email = (
        payload.email ||
        payload.customer_email ||
        payload.client_email ||
        payload.buyer_email ||
        payload?.customer?.email ||
        payload?.cliente?.email
      )?.toString().trim().toLowerCase();

      if (!email) {
        log('⚠ Webhook sem e-mail no payload. Nenhum usuário foi criado.');
      } else {
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', email)
          .maybeSingle();

        if (profileError) {
          log('❌ Erro ao consultar perfil:', profileError.message);
        } else if (existingProfile) {
          log(`✓ Perfil já existe para ${email}`);
        } else {
          const generatedPassword = crypto.randomBytes(18).toString('base64url');
          const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
            email,
            password: generatedPassword,
            email_confirm: true,
            user_metadata: {
              full_name:
                payload.name || payload.customer_name || payload.client_name || payload?.customer?.name || 'Assinante',
              source: 'webhook-payment'
            }
          });

          if (createUserError) {
            log('❌ Erro ao criar usuário no Auth:', createUserError.message);
          } else {
            log(`✓ Usuário criado no Auth e profile gerado: ${newUser.user?.id}`);

            if (newUser.user?.id) {
              const { error: upsertProfileError } = await supabase.from('profiles').upsert(
                {
                  id: newUser.user.id,
                  email,
                  full_name:
                    payload.name || payload.customer_name || payload.client_name || payload?.customer?.name || 'Assinante',
                  role: 'membro',
                },
                { onConflict: 'id' }
              );

              if (upsertProfileError) {
                log('❌ Erro ao garantir profile após criação do auth user:', upsertProfileError.message);
              } else {
                log('✓ Profile garantido via upsert');
              }
            }
          }
        }
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
