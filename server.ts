import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

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

// Gerar senha temporária a partir do CPF/CNPJ
const generateTemporaryPassword = (document: string): string => {
  // Remove caracteres especiais do documento
  const cleanDocument = document.replace(/[^\d]/g, '');
  return cleanDocument;
};

// Validar token do webhook
const validateWebhookToken = (req: Request): boolean => {
  const token = req.headers['authorization'] || 
                req.headers['x-webhook-token'] || 
                req.query.token;
  
  log('Token recebido:', token);
  log('Headers completos:', req.headers);
  
  // Por enquanto, apenas log do token recebido
  // Será validado quando o token real for fornecido
  if (!token) {
    log('❌ Token não fornecido no request');
    return false;
  }
  
  log('✓ Token presente no request');
  return true;
};

// Webhook endpoint
app.post('/api/webhooks/payment', async (req: Request, res: Response) => {
  try {
    log('='.repeat(80));
    log('📨 Webhook de pagamento recebido');
    log('Body completo:', JSON.stringify(req.body, null, 2));
    log('Headers completos:', req.headers);
    log('Query params:', req.query);
    log('='.repeat(80));

    // Validar token
    if (!validateWebhookToken(req)) {
      log('❌ Falha na validação do token');
      return res.status(401).json({ 
        success: false, 
        error: 'Token inválido ou não fornecido' 
      });
    }

    // Por enquanto, apenas confirmar recebimento
    res.status(200).json({
      success: true,
      message: 'Webhook recebido com sucesso. Aguardando análise do payload.',
      receivedAt: new Date().toISOString(),
      payload: req.body
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
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    webhook_endpoint: `${process.env.APP_URL || 'http://localhost:3001'}/api/webhooks/payment`
  });
});

// Listar todos os endpoints disponíveis
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'API de Webhooks GATHO',
    endpoints: {
      health: 'GET /api/health',
      webhook_payment: 'POST /api/webhooks/payment',
      documentation: 'Webhook aguardando primeiro evento de teste para mapeamento'
    },
    webhook_details: {
      url: `${process.env.APP_URL || 'http://localhost:3001'}/api/webhooks/payment`,
      method: 'POST',
      auth: 'Bearer token via header Authorization ou X-Webhook-Token',
      status: 'Ativo - Aguardando evento de teste'
    }
  });
});

// Tratamento de erros global
app.use((err: any, req: Request, res: Response) => {
  log('❌ Erro não tratado:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Erro interno do servidor',
    details: err.message 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  log(`🚀 Servidor rodando na porta ${PORT}`);
  log(`📍 Endpoint webhook: http://localhost:${PORT}/api/webhooks/payment`);
  log(`💊 Health check: http://localhost:${PORT}/api/health`);
  log(`📚 Documentação: http://localhost:${PORT}/api`);
});

export default app;
