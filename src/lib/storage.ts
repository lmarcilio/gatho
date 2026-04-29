import { useState, useEffect } from 'react';
import { supabase } from './supabase';

const defaultTools = [
  { id: "1", name: "Midjourney", desc: "Geração de imagens de altíssima qualidade a partir de texto.", category: "Imagem", price_type: "Pago", is_popular: true, img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80", url: "https://midjourney.com", videos: [{ title: "Tutorial Básico", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }], is18Plus: false },
  { id: "2", name: "Claude 3.5 Sonnet", desc: "O modelo mais inteligente e rápido da Anthropic para textos e código.", category: "Texto/Código", price_type: "Freemium", is_popular: true, img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80", url: "https://claude.ai", videos: [], is18Plus: false },
  { id: "3", name: "n8n", desc: "Automação de fluxos de trabalho open-source e baseada em nós.", category: "Automação", price_type: "Freemium", is_popular: false, img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80", url: "https://n8n.io", videos: [], is18Plus: false },
];

const defaultPrompts = [
  { id: "1", title: "Copywriting Persuasivo", type: "ChatGPT", category: "Copywriting", subcategory: "Vendas", level: "Avançado", copy: "Atue como um copywriter...", is18Plus: false },
  { id: "2", title: "Retrato Cinematográfico", type: "Midjourney", category: "Imagens", subcategory: "Fotografia", level: "Intermediário", copy: "A cinematic portrait of...", is18Plus: false },
];

const defaultAulas = [
  { id: "1", title: "1. Introdução ao Midjourney v6", module: "Módulo 1: Fundamentos", description: "Aprenda o básico do Midjourney", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", is18Plus: false },
  { id: "2", title: "Guia de Parâmetros PDF", module: "Módulo 1: Fundamentos", description: "Baixe o guia completo de parâmetros", pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", is18Plus: false },
];

const defaultCursos = [
  { 
    id: "1", 
    title: "Mestrado em IA Generativa", 
    instructor: "Lucas Marcilo", 
    description: "Curso completo do básico ao avançado sobre IA.",
    pageLink: "https://example.com/curso",
    plans: [
      { type: "Mensal", url: "https://example.com/checkout/mensal" },
      { type: "Anual", url: "https://example.com/checkout/anual" }
    ],
    is18Plus: false
  },
];

const defaultBonus = [
  {
    id: "1",
    category: "Recursos",
    title: "Pack de Prompts",
    description: "Milhões de prompts testados para usar no dia a dia.",
    pageLink: "https://example.com/pack",
    videos: [
      { title: "Instruções de Uso", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
    ],
    is18Plus: false
  }
];

const defaultConfig = {
  title: 'SaaS GATHO',
  supportEmail: 'ajuda@exemplo.com.br',
  accentColor: '#C026D3',
  registrationOpen: true,
  logoUrl: '',
  logo18Url: '',
  logoHeight: 32
};

const APP_SETTINGS_ID = 1;

// Helper for local storage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new Event('local-storage'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) setStoredValue(JSON.parse(item));
      } catch (error) {
        console.log(error);
      }
    };
    window.addEventListener('local-storage', handleStorageChange);
    return () => window.removeEventListener('local-storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}

export function useTools() { 
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToolsFromSupabase();
  }, []);

  const loadToolsFromSupabase = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Erro ao carregar ferramentas do Supabase:', error);
        setTools([]);
        return;
      }

      if (data && data.length > 0) {
        const formattedTools = data.map((tool: any) => ({
          id: tool.id,
          name: tool.name,
          desc: tool.description,
          category: tool.category,
          price_type: tool.price_type,
          is_popular: tool.is_popular,
          img: tool.image_url,
          url: tool.tool_url,
          videos: tool.youtube_refs || [],
          is18Plus: false
        }));
        setTools(formattedTools);
      } else {
        setTools([]);
      }
    } catch (error) {
      console.error('Erro crítico ao carregar ferramentas:', error);
      setTools([]);
    } finally {
      setLoading(false);
    }
  };

  return [tools, setTools] as const;
}

export function usePrompts() { 
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromptsFromSupabase();
  }, []);

  const loadPromptsFromSupabase = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Erro ao carregar prompts do Supabase:', error);
        setPrompts([]);
        return;
      }

      if (data && data.length > 0) {
        const formattedPrompts = data.map((prompt: any) => ({
          id: prompt.id,
          title: prompt.title,
          type: prompt.ai_type,
          category: prompt.category,
          subcategory: prompt.category,
          level: prompt.difficulty_level,
          copy: prompt.prompt_text,
          is18Plus: prompt.is_premium ? false : false
        }));
        setPrompts(formattedPrompts);
      } else {
        setPrompts([]);
      }
    } catch (error) {
      console.error('Erro crítico ao carregar prompts:', error);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  return [prompts, setPrompts] as const;
}

export function useAulas() { 
  const [aulas, setAulas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAulasFromSupabase();
  }, []);

  const loadAulasFromSupabase = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Erro ao carregar aulas do Supabase:', error);
        setAulas([]);
        return;
      }

      if (data && data.length > 0) {
        const formattedAulas = data.map((aula: any) => ({
          id: aula.id,
          title: aula.title,
          module: aula.category,
          description: aula.description,
          videoUrl: aula.video_url,
          pdfUrl: aula.pdf_url,
          is18Plus: false
        }));
        setAulas(formattedAulas);
      } else {
        setAulas([]);
      }
    } catch (error) {
      console.error('Erro crítico ao carregar aulas:', error);
      setAulas([]);
    } finally {
      setLoading(false);
    }
  };

  return [aulas, setAulas] as const;
}

export function useCursos() { return useLocalStorage('sf_cursos', defaultCursos); }
export function useBonus() { return useLocalStorage('sf_bonus', defaultBonus); }
export function use18PlusMode() { return useLocalStorage('sf_18plus_mode', false); }

export async function loadConfigFromSupabase() {
  const { data, error } = await supabase
    .from('app_settings')
    .select('title, support_email, accent_color, registration_open, logo_url, logo_18_url, logo_height')
    .eq('id', APP_SETTINGS_ID)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    title: data.title ?? defaultConfig.title,
    supportEmail: data.support_email ?? defaultConfig.supportEmail,
    accentColor: data.accent_color ?? defaultConfig.accentColor,
    registrationOpen: data.registration_open ?? defaultConfig.registrationOpen,
    logoUrl: data.logo_url ?? '',
    logo18Url: data.logo_18_url ?? '',
    logoHeight: data.logo_height ?? defaultConfig.logoHeight
  };
}

export async function saveConfigToSupabase(config: typeof defaultConfig) {
  const payload = {
    id: APP_SETTINGS_ID,
    title: config.title,
    support_email: config.supportEmail,
    accent_color: config.accentColor,
    registration_open: config.registrationOpen,
    logo_url: config.logoUrl,
    logo_18_url: config.logo18Url,
    logo_height: config.logoHeight,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from('app_settings').upsert(payload);
  if (error) throw error;
}

export async function uploadLogoToSupabase(file: File, is18: boolean) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
  const filePath = `branding/${is18 ? 'logo-18' : 'logo'}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('branding')
    .upload(filePath, file, { upsert: true, contentType: file.type || undefined });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('branding').getPublicUrl(filePath);
  return data.publicUrl;
}

export function useConfig() {
  const [config, setConfig] = useLocalStorage('sf_config', defaultConfig);

  useEffect(() => {
    const syncConfig = async () => {
      try {
        const remoteConfig = await loadConfigFromSupabase();
        if (remoteConfig) setConfig(remoteConfig);
      } catch (error) {
        console.warn('Erro ao sincronizar config global:', error);
      }
    };

    syncConfig();
  }, []);

  return [config, setConfig] as const;
}
