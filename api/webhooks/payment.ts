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

// Hash de senha
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Webhook-Token, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      log('='.repeat(80));
      log('📨 Webhook de pagamento recebido');
      log('Body completo:', JSON.stringify(req.body, null, 2));
      log('Headers completos:', JSON.stringify(req.headers, null, 2));
      log('Query params:', req.query);
      log('='.repeat(80));

      // Validar token
      const token = req.headers.authorization?.replace('Bearer ', '') || 
                    req.headers['x-webhook-token'] || 
                    req.query.token;
      
      log('Token recebido:', token);
      
      if (!token) {
        log('❌ Token não fornecido no request');
        return res.status(401).json({ 
          success: false, 
          error: 'Token inválido ou não fornecido',
          received_at: new Date().toISOString()
        });
      }

      // Retornar confirmação de recebimento
      res.status(200).json({
        success: true,
        message: 'Webhook recebido com sucesso. Estrutura analisada.',
        received_at: new Date().toISOString(),
        payload_received: req.body
      });

      log('✓ Resposta 200 enviada');
      log('='.repeat(80));

    } catch (error) {
      log('❌ Erro no webhook:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao processar webhook',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  } else if (req.method === 'GET') {
    res.status(200).json({
      message: 'API de Webhooks GATHO',
      webhook_endpoint: 'POST https://seu-deploy.vercel.app/api/webhooks/payment',
      status: 'Ativo - Aguardando evento de teste',
      auth: 'Bearer token via Authorization header ou X-Webhook-Token'
    });
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
