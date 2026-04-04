# 📚 BOT HGL - REDE SOCIAIS E CORTES DE VÍDEO
## Documentação Técnica Completa

---

## 📋 **ÍNDICE**

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura de Diretórios](#estrutura-de-diretórios)
5. [Páginas e Funcionalidades](#páginas-e-funcionalidades)
6. [APIs e Endpoints](#apis-e-endpoints)
7. [Fluxo de Processamento](#fluxo-de-processamento)
8. [Banco de Dados](#banco-de-dados)
9. [Guia de Instalação](#guia-de-instalação)
10. [Configuração](#configuração)

---

## 🎯 **VISÃO GERAL**

**Nome do Projeto:** BOT HGL - Rede Sociais e Cortes de Vídeo

**Descrição:** 
Plataforma completa para criação automática de cortes virais de vídeos com:
- Upload de vídeos via URL (YouTube, etc)
- Divisão automática em cortes otimizados
- Aplicação de "quebra de originalidade" (anti-detecção de duplicidade)
- Gerenciamento de múltiplas redes sociais
- Sistema de agendamento de posts
- Análise com IA (futuro)

**Inspiração:** Clone do Real Oficial (app.realoficial.com.br)

**Cores da Marca:** Amarelo e Verde (Bandeira do Brasil 🇧🇷)

---

## 🏗️ **ARQUITETURA DO SISTEMA**

### **Stack Tecnológico:**

```
┌─────────────────────────────────────────┐
│           FRONTEND (React)              │
│   - React 18 + React Router            │
│   - Tailwind CSS + Shadcn UI           │
│   - Axios para HTTP requests           │
└─────────────────────────────────────────┘
                  ↕ HTTP/REST
┌─────────────────────────────────────────┐
│          BACKEND (FastAPI)              │
│   - FastAPI (Python)                    │
│   - JWT Authentication                  │
│   - Background Tasks                    │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│         BANCO DE DADOS                  │
│   - MongoDB (AsyncIO Motor)             │
│   - Collections: users, videos,         │
│     processing_jobs, clips              │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│      PROCESSAMENTO DE VÍDEO             │
│   - FFmpeg (cortes e edição)            │
│   - yt-dlp (download de vídeos)         │
│   - Playwright (automação Kwai/Snap)    │
└─────────────────────────────────────────┘
```

---

## 💻 **TECNOLOGIAS UTILIZADAS**

### **Frontend:**
- **React** 18.2.0 - Framework JavaScript
- **React Router** 6.x - Roteamento
- **Tailwind CSS** 3.x - Estilização
- **Shadcn UI** - Componentes UI
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP

### **Backend:**
- **FastAPI** 0.104.x - Framework Python
- **Motor** - Driver MongoDB assíncrono
- **PyJWT** - Autenticação JWT
- **Passlib** - Hash de senhas (bcrypt)
- **Python-multipart** - Upload de arquivos

### **Processamento:**
- **FFmpeg** - Edição e corte de vídeos
- **yt-dlp** - Download de vídeos do YouTube
- **Playwright** - Automação de navegador

### **Banco de Dados:**
- **MongoDB** 6.x - Banco NoSQL

---

## 📁 **ESTRUTURA DE DIRETÓRIOS**

```
BOT_HGL_REDE_SOCIAIS_CORTES/
│
├── frontend/                      # Aplicação React
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/           # Componentes reutilizáveis
│   │   │   ├── ui/              # Componentes Shadcn UI
│   │   │   ├── Header.jsx       # Cabeçalho da aplicação
│   │   │   ├── Sidebar.jsx      # Menu lateral
│   │   │   ├── ChatWidget.jsx   # Widget de chat IA
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── GoogleLoginButton.jsx
│   │   │
│   │   ├── context/             # Context API
│   │   │   └── AuthContext.jsx  # Contexto de autenticação
│   │   │
│   │   ├── pages/               # Páginas da aplicação
│   │   │   ├── Login.jsx        # Tela de login
│   │   │   ├── Dashboard.jsx    # Dashboard principal
│   │   │   ├── VideoConfigPage.jsx # Config de cortes
│   │   │   ├── VideoEditor.jsx  # Editor de vídeo
│   │   │   ├── HubConteudo.jsx  # Hub de projetos
│   │   │   ├── MeusVideos.jsx   # Biblioteca de vídeos
│   │   │   ├── Agendamento.jsx  # Agendamento de posts
│   │   │   ├── BrandKit.jsx     # Kit de marca
│   │   │   ├── Campeonatos.jsx  # Campeonatos
│   │   │   ├── RedesSociais.jsx # Conectar redes sociais
│   │   │   ├── Lives.jsx        # Monitor de lives
│   │   │   ├── FilaEconomica.jsx # Fila de processamento
│   │   │   ├── Financeiro.jsx   # Planos e pagamentos
│   │   │   └── Configuracoes.jsx # Configurações gerais
│   │   │
│   │   ├── App.js               # Componente raiz
│   │   ├── index.js             # Entry point
│   │   └── index.css            # Estilos globais
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env                     # Variáveis de ambiente
│
├── backend/                      # API FastAPI
│   ├── routes/                  # Rotas da API
│   │   ├── auth.py             # Autenticação (login/registro)
│   │   ├── video_processing.py # Processamento de vídeos
│   │   ├── kwai.py             # Integração Kwai
│   │   └── ...
│   │
│   ├── models/                  # Modelos de dados
│   │   └── user.py
│   │
│   ├── utils/                   # Utilitários
│   │   └── auth.py             # Helper de autenticação
│   │
│   ├── automation/              # Automação com Playwright
│   │   └── kwai_bot.py         # Bot de postagem Kwai
│   │
│   ├── uploads/                 # Vídeos originais (temporário)
│   ├── processed/               # Vídeos processados
│   │
│   ├── server.py                # Servidor FastAPI principal
│   ├── dependencies.py          # Dependências globais
│   ├── requirements.txt         # Dependências Python
│   └── .env                     # Variáveis de ambiente
│
├── DOCUMENTACAO_COMPLETA.md     # Esta documentação
├── INSTALACAO.md                # Guia de instalação
└── README.md                    # Readme principal
```

---

## 📄 **PÁGINAS E FUNCIONALIDADES**

### **1. Login.jsx**
**Rota:** `/login`

**Funcionalidade:**
- Login via Email/Senha
- Login via Google OAuth (requer configuração)
- Botões de Apple/Facebook (em desenvolvimento)
- Registro de novos usuários

**Componentes:**
```javascript
- GoogleLoginButton: Botão de login Google
- Formulário de email/senha
- Link para recuperação de senha
```

**Fluxo:**
1. Usuário insere email e senha
2. Requisição para `/api/auth/login`
3. Recebe token JWT
4. Salva token no localStorage
5. Redireciona para `/dashboard`

---

### **2. Dashboard.jsx**
**Rota:** `/dashboard`

**Funcionalidade:**
- Upload de vídeos via URL
- Upload de vídeos via arquivo local
- Análise prévia do vídeo
- Estatísticas rápidas

**Componentes:**
```javascript
- Input de URL (YouTube, TikTok, etc)
- Área de drag-and-drop para arquivos
- Cards de estatísticas
- Lista de vídeos recentes
```

**Fluxo:**
1. Usuário cola URL do YouTube
2. Clica "Fazer Upload"
3. Sistema analisa o vídeo (duração, título, thumbnail)
4. Redireciona para `/video-config` com informações do vídeo

**Função Principal:**
```javascript
const analyzeVideo = async (url) => {
  // Extrai ID do YouTube
  // Busca informações do vídeo
  // Cria objeto videoInfo
  // Navega para página de configuração
}
```

---

### **3. VideoConfigPage.jsx**
**Rota:** `/video-config`

**Funcionalidade:**
- Configurar formato do vídeo (Vertical/Horizontal)
- Escolher enquadramento (Automático, Centro, Foco, etc)
- Definir duração de cada corte
- Visualizar cálculo de quantos cortes serão gerados

**Componentes:**
```javascript
- Card de informações do vídeo (thumbnail, título, duração)
- Seletor de formato (9:16 ou 16:9)
- Seletor de enquadramento (5 opções)
- Seletor de duração (7 opções: automático, 30s, 1min, etc)
- Card de preview do cálculo
```

**Fluxo:**
1. Usuário escolhe configurações
2. Sistema calcula quantos cortes serão gerados (lógica matemática)
3. Mostra preview do cálculo
4. Clica "Próximo"
5. Envia para API `/api/video/process-clips`
6. Redireciona para `/editor` com job_id

**Lógica de Cálculo:**
```javascript
// Exemplo: vídeo de 3000s, duração desejada 180s
const numClips = Math.round(totalSeconds / desiredDuration);
// 3000 / 180 = 16.67 → arredonda para 17

const realDuration = totalSeconds / numClips;
// 3000 / 17 = 176.47 segundos por corte
```

**Função Principal:**
```javascript
const handleNext = async () => {
  // 1. Validar token
  // 2. Preparar dados
  // 3. Fazer fetch para /api/video/process-clips
  // 4. Receber job_id
  // 5. Navegar para editor com job_id
}
```

---

### **4. VideoEditor.jsx**
**Rota:** `/editor`

**Funcionalidade:**
- Mostrar progresso do processamento (5 etapas)
- Fazer polling do status do job
- Exibir cortes gerados quando completo
- Permitir edição de cortes

**Componentes:**
```javascript
- Barra de progresso (5 etapas)
- Grid de clips gerados
- Preview de cada clip
- Botões de ação (baixar, compartilhar, editar)
```

**Fluxo:**
1. Recebe job_id da página anterior
2. Inicia polling (a cada 2 segundos)
3. Consulta `/api/video/job-status/{job_id}`
4. Atualiza barra de progresso
5. Quando status = "completed", mostra clips
6. Se status = "failed", mostra erro

**Etapas de Processamento:**
```
1. ⬇️ Baixando vídeo (download com yt-dlp)
2. 🎙️ Transcrevendo áudio (futuro)
3. 🤖 Analisando com IA (futuro)
4. ✂️ Criando cortes (FFmpeg trabalhando)
5. ✅ Finalizando (salvando no banco)
```

**Polling de Status:**
```javascript
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await fetch(`/api/video/job-status/${jobId}`);
    const data = await response.json();
    
    if (data.status === 'completed') {
      clearInterval(interval);
      setClips(data.clips);
    }
  }, 2000);
}, [jobId]);
```

---

### **5. Configuracoes.jsx**
**Rota:** `/configuracoes`

**Funcionalidade:**
- Configurar Assistente de IA (GPT, DeepSeek, etc)
- Cadastrar APIs de redes sociais
- Configurar pagamentos (PIX, Mercado Pago)
- Configurar WhatsApp
- Gerenciar notificações

**Abas:**
1. **Assistente IA**
   - Escolher provedor (OpenAI, DeepSeek, etc)
   - Inserir API Key
   - Configurar prompt de sistema

2. **Redes Sociais** ⭐ (NOVA)
   - TikTok (API Key + Secret)
   - Instagram (Access Token)
   - YouTube (API Key + Channel ID)
   - Kwai (Telefone)
   - Snapchat (Username + Senha)
   - Telegram (Bot Token)
   - WeChat (App ID + Secret)

3. **Pagamentos**
   - Chave PIX
   - Token Mercado Pago
   - Credenciais PagSeguro

4. **WhatsApp**
   - Número de telefone
   - Enable/Disable notificações

5. **Notificações**
   - Preferências de notificações

---

### **6. MeusVideos.jsx**
**Rota:** `/meus-videos`

**Funcionalidade:**
- Biblioteca de todos os vídeos processados
- Filtrar por projeto
- Buscar vídeos
- Ver status de geração

---

### **7. Agendamento.jsx**
**Rota:** `/agendamento`

**Funcionalidade:**
- Calendário de posts agendados
- Agendar novos posts
- Agendar em lote
- Ver histórico

---

### **8. RedesSociais.jsx**
**Rota:** `/redes-sociais`

**Funcionalidade:**
- Conectar contas de redes sociais
- Ver status das conexões
- Desconectar contas

---

### **9. Campeonatos.jsx**
**Rota:** `/campeonatos`

**Funcionalidade:**
- Participar de campeonatos de cortes
- Ver rankings
- Receber prêmios via PIX

---

### **10. Financeiro.jsx**
**Rota:** `/financeiro`

**Funcionalidade:**
- Ver planos disponíveis
- Assinar planos
- Gerenciar assinatura
- Histórico de pagamentos

---

## 🔌 **APIS E ENDPOINTS**

### **Autenticação**

#### **POST /api/auth/register**
Registrar novo usuário

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso"
}
```

---

#### **POST /api/auth/login**
Fazer login

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com"
  }
}
```

---

### **Processamento de Vídeo**

#### **POST /api/video/process-clips**
Iniciar processamento de vídeo com divisão automática

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=...",
  "video_duration": 3000,
  "clip_duration": 180,
  "format": "vertical",
  "framing": "automatico",
  "apply_bypass": true
}
```

**Response:**
```json
{
  "success": true,
  "job_id": "uuid",
  "num_clips": 17,
  "real_clip_duration": 176.47,
  "estimated_time_seconds": 170,
  "message": "Processamento iniciado! 17 cortes serão gerados."
}
```

---

#### **GET /api/video/job-status/{job_id}**
Consultar status do processamento

**Headers:**
```
Authorization: Bearer {token}
```

**Response (em progresso):**
```json
{
  "id": "job_id",
  "status": "cutting",
  "progress": 45,
  "num_clips": 17
}
```

**Response (completo):**
```json
{
  "id": "job_id",
  "status": "completed",
  "progress": 100,
  "num_clips": 17,
  "clips": [
    {
      "clip_number": 1,
      "file_path": "/app/backend/processed/clip_1.mp4",
      "start_time": 0,
      "end_time": 176.47,
      "duration": 176.47,
      "bypass_applied": true
    }
  ]
}
```

---

#### **POST /api/video/cut/{video_id}**
Cortar vídeo específico (endpoint antigo, mantido para compatibilidade)

**Request:**
```json
{
  "start_time": "00:00:10",
  "end_time": "00:00:40",
  "apply_bypass": true
}
```

---

## 🔄 **FLUXO DE PROCESSAMENTO**

### **Fluxo Completo de Upload até Cortes:**

```
1. UPLOAD (Dashboard)
   └─> Usuário cola URL do YouTube
   └─> Dashboard analisa URL
       └─> Extrai ID do vídeo
       └─> Busca thumbnail
       └─> Extrai duração (se possível)

2. CONFIGURAÇÃO (VideoConfigPage)
   └─> Usuário escolhe:
       - Formato (Vertical/Horizontal)
       - Enquadramento (Automático/Centro/Foco/etc)
       - Duração de cada corte (15s/30s/1min/etc)
   └─> Sistema calcula:
       - Número de cortes
       - Duração real de cada corte
   └─> Usuário clica "Próximo"

3. PROCESSAMENTO BACKEND (process_video_clips)
   └─> ETAPA 1: Download
       - yt-dlp baixa vídeo do YouTube
       - Salva em /app/backend/uploads/
   
   └─> ETAPA 2: Divisão
       - Calcula timestamps de cada corte
       - Para cada corte:
           └─> FFmpeg corta o vídeo
           └─> Aplica "quebra de originalidade":
               - Trim 0.01s início e fim
               - Speed up 0.2%
               - Filtro suave 0.2%
           └─> Redimensiona (720x1280 ou 1280x720)
           └─> Salva em /app/backend/processed/
   
   └─> ETAPA 3: Banco de Dados
       - Salva informações de cada clip no MongoDB
       - Atualiza status do job

4. POLLING (VideoEditor)
   └─> Frontend consulta status a cada 2s
   └─> Atualiza barra de progresso
   └─> Quando completo:
       └─> Exibe lista de clips
       └─> Permite download/compartilhamento
```

---

### **Lógica Matemática de Divisão:**

```python
# Exemplo: Vídeo de 50 min (3000s), usuário quer 3 min (180s)

total_seconds = 3000
desired_duration = 180

# Passo 1: Calcular número de cortes (arredondado)
num_clips = round(total_seconds / desired_duration)
# 3000 / 180 = 16.67 → 17 cortes

# Passo 2: Calcular duração real de cada corte
real_duration = total_seconds / num_clips
# 3000 / 17 = 176.47 segundos (~2.94 minutos)

# Passo 3: Gerar timestamps
for i in range(num_clips):
    start_time = i * real_duration
    end_time = start_time + real_duration
    
    # Processar corte[i]
```

---

### **Comando FFmpeg (Quebra de Originalidade):**

```bash
ffmpeg \
  -ss 0.01 \                          # Skip 0.01s do início
  -i video.mp4 \                      # Vídeo de entrada
  -to 176.47 \                        # Duração do corte
  -filter_complex "\
    [0:v]setpts=0.998*PTS,\           # Speed up 0.2%
    eq=brightness=0.002:contrast=1.002,\ # Filtro suave 0.2%
    scale=720:1280[v];\                # Redimensionar (vertical)
    [0:a]atempo=1.002[a]" \           # Speed up áudio 0.2%
  -map "[v]" \
  -map "[a]" \
  -c:v libx264 \                      # Codec vídeo
  -preset fast \
  -crf 23 \
  -c:a aac \                          # Codec áudio
  -b:a 192k \
  clip_1.mp4                          # Arquivo de saída
```

**Por que isso funciona?**
- Trim 0.01s: Remove pixels exatos do início/fim
- Speed 0.2%: Imperceptível ao olho humano, muda hash do vídeo
- Filtro suave: Altera minimamente brilho/contraste
- Resultado: Vídeo "diferente" para algoritmos de detecção

---

## 🗄️ **BANCO DE DADOS**

### **MongoDB Collections:**

#### **1. users**
```javascript
{
  "_id": ObjectId,
  "id": "uuid",
  "email": "usuario@example.com",
  "hashed_password": "bcrypt_hash",
  "created_at": "2026-04-03T20:00:00Z"
}
```

#### **2. processing_jobs**
```javascript
{
  "_id": ObjectId,
  "id": "job_uuid",
  "user_id": "user_uuid",
  "video_url": "https://youtube.com/...",
  "total_duration": 3000,
  "desired_clip_duration": 180,
  "num_clips": 17,
  "real_clip_duration": 176.47,
  "format": "vertical",
  "framing": "automatico",
  "apply_bypass": true,
  "status": "completed",  // processing, cutting, completed, failed
  "progress": 100,
  "clips": [
    {
      "clip_number": 1,
      "file_path": "/path/to/clip_1.mp4",
      "start_time": 0,
      "end_time": 176.47,
      "duration": 176.47,
      "bypass_applied": true
    }
  ],
  "created_at": "2026-04-03T20:00:00Z",
  "completed_at": "2026-04-03T20:05:00Z"
}
```

#### **3. videos**
```javascript
{
  "_id": ObjectId,
  "id": "video_uuid",
  "user_id": "user_uuid",
  "title": "Título do Vídeo",
  "url": "https://youtube.com/...",
  "duration": 3000,
  "thumbnail": "https://...",
  "views": 1000000,
  "upload_date": "2026-04-01",
  "file_path": "/path/to/video.mp4",
  "status": "processed"
}
```

#### **4. clips**
```javascript
{
  "_id": ObjectId,
  "id": "clip_uuid",
  "user_id": "user_uuid",
  "video_id": "video_uuid",
  "job_id": "job_uuid",
  "file_path": "/path/to/clip.mp4",
  "start_time": 0,
  "end_time": 176.47,
  "duration": 176.47,
  "bypass_applied": true,
  "created_at": "2026-04-03T20:00:00Z"
}
```

---

## 🚀 **GUIA DE INSTALAÇÃO**

Ver arquivo: `INSTALACAO.md`

---

## ⚙️ **CONFIGURAÇÃO**

### **Variáveis de Ambiente:**

#### **Frontend (.env)**
```env
REACT_APP_BACKEND_URL=https://seu-dominio.com
REACT_APP_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
```

#### **Backend (.env)**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=hgl_db
JWT_SECRET=sua-chave-secreta-aqui
JWT_ALGORITHM=HS256
```

---

## 🎨 **DESIGN SYSTEM**

### **Cores:**
```css
--primary-yellow: #FACC15    /* Amarelo Brasil */
--primary-green: #84CC16     /* Verde Brasil */
--background-black: #000000  /* Fundo preto */
--gray-900: #111111          /* Cards escuros */
--gray-800: #1F1F1F          /* Borders */
```

### **Tipografia:**
```css
H1: text-3xl (30px)
H2: text-xl (20px)
Body: text-base (16px)
Small: text-sm (14px)
```

---

## 📞 **SUPORTE**

Para dúvidas ou problemas:
1. Consulte esta documentação
2. Verifique o arquivo INSTALACAO.md
3. Entre em contato com o desenvolvedor

---

**Última Atualização:** 03/04/2026
**Versão:** 1.0.0
