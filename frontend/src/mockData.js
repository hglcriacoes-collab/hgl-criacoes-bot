// Mock data for HGL Platform

export const socialNetworks = [
  { id: 'youtube', name: 'YouTube', icon: 'youtube', color: '#FF0000', connected: false },
  { id: 'tiktok', name: 'TikTok', icon: 'music', color: '#000000', connected: false },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#E1306C', connected: false },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#1877F2', connected: false },
  { id: 'twitter', name: 'Twitter/X', icon: 'twitter', color: '#1DA1F2', connected: false },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#0A66C2', connected: false },
  { id: 'threads', name: 'Threads', icon: 'at-sign', color: '#000000', connected: false },
  { id: 'reddit', name: 'Reddit', icon: 'message-circle', color: '#FF4500', connected: false },
  { id: 'pinterest', name: 'Pinterest', icon: 'pinterest', color: '#E60023', connected: false },
  { id: 'bluesky', name: 'Bluesky', icon: 'share-2', color: '#1185FE', connected: false },
  { id: 'kwai', name: 'Kwai', icon: 'video', color: '#FF6B00', connected: false },
  { id: 'snapchat', name: 'Snapchat', icon: 'camera', color: '#FFFC00', connected: false }
];

export const pricingPlans = [
  {
    id: 'lite',
    name: 'Lite',
    price: 49.90,
    popular: false,
    credits: 180,
    videoHours: 3,
    clipsPerMonth: 7200,
    extras: 140000,
    features: [
      'Clipes em até 4K usando seu computador',
      'Editor profissional',
      'Legendas automáticas',
      '1 rede social conectada',
      'Ajustar janela do corte'
    ]
  },
  {
    id: 'criador',
    name: 'Criador',
    price: 89.90,
    popular: true,
    credits: 360,
    videoHours: 6,
    clipsPerMonth: 14400,
    extras: 140000,
    features: [
      'Clipes em até 4K usando seu computador',
      'Editor profissional',
      'Legendas automáticas',
      '3 redes sociais conectadas',
      'Ajustar janela do corte'
    ]
  },
  {
    id: 'viral',
    name: 'Viral',
    price: 149.90,
    popular: false,
    credits: 540,
    videoHours: 9,
    clipsPerMonth: 28800,
    extras: 140000,
    features: [
      'Clipes em até 4K usando seu computador',
      'Editor profissional',
      'Legendas automáticas',
      '6 redes sociais conectadas',
      'Ajustar janela do corte'
    ]
  }
];

export const recentProjects = [
  {
    id: '1',
    title: 'Os Trapalhões na TV vol 1',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    status: 'Análise Concluída',
    duration: '15:00 — 32:53',
    views: '9.1M',
    engagement: '30s',
    algorithm: 'Alto'
  }
];

export const tools = [
  {
    id: 'auto-cuts',
    name: 'Cortes Automáticos',
    description: 'Detecta automaticamente os melhores momentos',
    icon: 'scissors'
  },
  {
    id: 'reframe',
    name: 'Reframe de Vídeo',
    description: 'Detecta automaticamente os melhores momentos',
    icon: 'crop'
  },
  {
    id: 'from-scratch',
    name: 'Projeto do zero',
    description: 'Abra o editor e crie seu vídeo do zero',
    icon: 'film'
  }
];

export const aiProviders = [
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo']
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-coder']
  },
  {
    id: 'emergent',
    name: 'Emergent LLM (Universal)',
    models: ['universal']
  }
];

export const userMockData = {
  name: 'Usuário',
  credits: 27,
  language: 'PT'
};