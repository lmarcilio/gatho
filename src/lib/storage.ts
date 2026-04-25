import { useState, useEffect } from 'react';

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

export function useTools() { return useLocalStorage('sf_tools', defaultTools); }
export function usePrompts() { return useLocalStorage('sf_prompts', defaultPrompts); }
export function useAulas() { return useLocalStorage('sf_aulas', defaultAulas); }
export function useCursos() { return useLocalStorage('sf_cursos', defaultCursos); }
export function useBonus() { return useLocalStorage('sf_bonus', defaultBonus); }
export function useConfig() { return useLocalStorage('sf_config', defaultConfig); }
export function use18PlusMode() { return useLocalStorage('sf_18plus_mode', false); }
