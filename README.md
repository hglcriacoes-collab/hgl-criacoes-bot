# 🚀 BOT HGL - REDE SOCIAIS E CORTES DE VÍDEO

![HGL Logo](https://img.shields.io/badge/HGL-Automação_Social-yellow?style=for-the-badge)
![Status](https://img.shields.io/badge/status-ativo-brightgreen?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)

## 📖 **O QUE É O BOT HGL?**

**BOT HGL (BOT_HGL_REDE_SOCIAIS_CORTES)** é uma plataforma completa para criação automática de cortes virais de vídeos com:

- ✂️ **Divisão Automática de Vídeos** usando lógica matemática inteligente
- 🎭 **Quebra de Originalidade** (anti-detecção de duplicidade)
- 📱 **Suporte para 12+ Redes Sociais** (TikTok, Instagram, YouTube, **Kwai**, **Snapchat**, etc)
- 🤖 **Automação com Playwright** para redes sem API oficial
- 🎨 **Editor de Vídeo Avançado** com FFmpeg
- 📊 **Agendamento de Posts** em lote
- 💰 **Sistema de Gamificação** com campeonatos e prêmios

---

## 🎯 **RECURSOS PRINCIPAIS**

### 🎬 **Processamento de Vídeo**
- Upload via URL (YouTube, Google Drive, etc) ou arquivo local
- **Extração automática de metadados** (título, duração, visualizações, canal)
- Divisão inteligente em cortes otimizados
- Aplicação de "quebra de originalidade":
  - Corte de 0.01s do início/fim
  - Aceleração de 0.2% (imperceptível)
  - Filtro suave de 0.2% de brilho/contraste

### 📱 **Redes Sociais Suportadas**
- ✅ TikTok (API Oficial)
- ✅ Instagram (Graph API)
- ✅ YouTube (Data API)
- ✅ **Kwai** (Playwright Bot)
- ✅ **Snapchat** (Playwright Bot)
- ✅ Telegram
- ✅ WeChat
- E mais...

### 🤖 **Assistente Virtual IA**
- Análise automática de vídeos
- Sugestão de legendas
- Detecção de humor e tom
- Integração com GPT, DeepSeek, etc

---

## 🚀 **INSTALAÇÃO RÁPIDA**

### **Opção 1: Script Automatizado (Recomendado)**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/BOT_HGL_REDE_SOCIAIS_CORTES.git
cd BOT_HGL_REDE_SOCIAIS_CORTES

# Execute o instalador
chmod +x install.sh
./install.sh
```

### **Opção 2: Instalação Manual**

Ver guia completo em: [INSTALACAO.md](./INSTALACAO.md)

---

## 📋 **PRÉ-REQUISITOS**

- **Node.js** 16+ e yarn
- **Python** 3.11+
- **MongoDB** 6.0+
- **FFmpeg** (para edição de vídeo)

---

## ▶️ **EXECUTAR**

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python3 server.py

# Terminal 2 - Frontend
cd frontend
yarn start
```

Acesse: **http://localhost:3000**

Credenciais de teste:
- **Email:** teste.urgente@hgl.com
- **Senha:** 123456

---

## 📚 **DOCUMENTAÇÃO**

- 📘 [Documentação Técnica Completa](./DOCUMENTACAO_COMPLETA.md)
- 🔧 [Guia de Instalação Detalhado](./INSTALACAO.md)

---

## 🎨 **DESIGN SYSTEM**

**Cores da Marca (Bandeira do Brasil 🇧🇷):**
- 🟡 Amarelo: `#FACC15`
- 🟢 Verde Limão: `#84CC16`
- ⚫ Fundo Preto: `#000000`

---

## 🏗️ **ARQUITETURA**

```
Frontend (React 18)
     ↕ HTTP/REST
Backend (FastAPI)
     ↕
MongoDB (Async Motor)
     ↕
FFmpeg + yt-dlp + Playwright
```

---

## 🔧 **TECNOLOGIAS UTILIZADAS**

**Frontend:**
- React 18.2
- Tailwind CSS
- Shadcn UI
- Axios

**Backend:**
- FastAPI (Python)
- Motor (MongoDB Async)
- JWT Authentication
- FFmpeg (Processamento)
- yt-dlp (Download de vídeos)
- Playwright (Automação)

---

## 📊 **STATUS DO PROJETO**

- ✅ Sistema de Autenticação
- ✅ Upload e Análise de Vídeos
- ✅ Extração de Metadados com yt-dlp
- ✅ Editor de Vídeo com Quebra de Originalidade
- ✅ Configuração de Redes Sociais
- ✅ Bot Playwright para Kwai
- 🚧 Bot para Snapchat (em desenvolvimento)
- 🚧 Integração com APIs oficiais (em desenvolvimento)
- 🚧 Assistente Virtual IA (em desenvolvimento)

---

## 🐛 **PROBLEMAS CONHECIDOS**

### ❌ ~~Erro "Body stream already read"~~ → **RESOLVIDO** ✅
- **Causa:** Faltava `import uuid4` no backend
- **Correção:** Adicionado import correto em `video_processing.py`

### ✅ Metadados Funcionando
- Extração automática de título, duração, visualizações e canal
- Integração completa com yt-dlp

---

## 🆘 **SUPORTE**

**Problemas com instalação?**
1. Verifique os pré-requisitos
2. Consulte [INSTALACAO.md](./INSTALACAO.md)
3. Consulte [DOCUMENTACAO_COMPLETA.md](./DOCUMENTACAO_COMPLETA.md)

---

## 📝 **LICENÇA**

Propriedade privada. Todos os direitos reservados.

---

## 🎉 **CHANGELOG**

### **v1.0.0** (04/04/2026)
- ✅ Corrigido erro crítico `uuid4 not defined`
- ✅ Implementada extração de metadados com yt-dlp
- ✅ Metadados exibidos em Dashboard e VideoConfigPage
- ✅ Documentação completa criada
- ✅ Sistema de cores Brasil aplicado globalmente

---

**Desenvolvido com ⚡ por HGL Team**

🇧🇷 **Proudly Made in Brazil** 🇧🇷
