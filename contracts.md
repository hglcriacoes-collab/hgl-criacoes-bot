# 📋 Contratos de API - Sistema HGL

## 🎯 Dados Mockados no Frontend

Os seguintes dados estão mockados em `/app/frontend/src/mockData.js`:

1. **socialNetworks**: 12 redes sociais (YouTube, TikTok, Instagram, Facebook, Twitter/X, LinkedIn, Threads, Reddit, Pinterest, Bluesky, Kwai, Snapchat)
2. **pricingPlans**: 3 planos (Lite, Criador, Viral)
3. **recentProjects**: Projetos de vídeo do usuário
4. **tools**: Ferramentas disponíveis
5. **aiProviders**: Provedores de IA
6. **userMockData**: Dados do usuário logado

---

## 🔌 API Endpoints para Implementação Backend

### **Autenticação**

#### `POST /api/auth/register`
**Request:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "credits": 0
  },
  "token": "string"
}
```

#### `POST /api/auth/login`
**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "credits": number
  },
  "token": "string"
}
```

---

### **Usuário**

#### `GET /api/user/profile`
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "credits": number,
  "plan": "lite|criador|viral",
  "connectedNetworks": ["youtube", "instagram"]
}
```

---

### **Redes Sociais**

#### `GET /api/social-networks`
**Response:**
```json
[
  {
    "id": "youtube",
    "name": "YouTube",
    "icon": "youtube",
    "color": "#FF0000",
    "connected": false
  }
]
```

#### `POST /api/social-networks/connect`
**Request:**
```json
{
  "networkId": "youtube",
  "accessToken": "string",
  "refreshToken": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "YouTube conectado com sucesso"
}
```

#### `DELETE /api/social-networks/disconnect/:networkId`
**Response:**
```json
{
  "success": true,
  "message": "YouTube desconectado"
}
```

---

### **Projetos/Vídeos**

#### `POST /api/projects`
**Request:**
```json
{
  "videoUrl": "string (optional)",
  "file": "file (optional)",
  "title": "string"
}
```
**Response:**
```json
{
  "id": "string",
  "title": "string",
  "status": "processing",
  "createdAt": "datetime"
}
```

#### `GET /api/projects`
**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "thumbnail": "string",
    "status": "completed",
    "duration": "15:00 — 32:53",
    "views": "9.1M",
    "engagement": "30s",
    "algorithm": "Alto",
    "createdAt": "datetime"
  }
]
```

#### `GET /api/projects/:id`
**Response:**
```json
{
  "id": "string",
  "title": "string",
  "videoUrl": "string",
  "thumbnail": "string",
  "clips": [
    {
      "id": "string",
      "startTime": "00:15",
      "endTime": "00:45",
      "score": 95
    }
  ]
}
```

#### `POST /api/projects/:id/generate-clips`
**Response:**
```json
{
  "jobId": "string",
  "status": "processing",
  "estimatedTime": 300
}
```

---

### **Planos/Pagamentos**

#### `GET /api/plans`
**Response:**
```json
[
  {
    "id": "lite",
    "name": "Lite",
    "price": 49.90,
    "credits": 180,
    "videoHours": 3,
    "features": ["..."]
  }
]
```

#### `POST /api/subscriptions`
**Request:**
```json
{
  "planId": "criador",
  "paymentMethod": "card|pix"
}
```
**Response:**
```json
{
  "subscriptionId": "string",
  "paymentUrl": "string (for PIX)",
  "status": "pending"
}
```

---

### **Configurações**

#### `GET /api/settings`
**Response:**
```json
{
  "ai": {
    "provider": "openai",
    "model": "gpt-4o",
    "enabled": false
  },
  "payment": {
    "pix": { "enabled": false, "key": "" },
    "mercadoPago": { "enabled": false, "key": "" },
    "pagSeguro": { "enabled": false, "key": "" }
  },
  "whatsapp": {
    "number": "",
    "enabled": false
  }
}
```

#### `PUT /api/settings/ai`
**Request:**
```json
{
  "provider": "openai",
  "model": "gpt-4o",
  "apiKey": "string",
  "systemPrompt": "string",
  "temperature": 0.7,
  "maxTokens": 500,
  "enabled": true
}
```

#### `PUT /api/settings/payment`
**Request:**
```json
{
  "method": "pix|mercadoPago|pagSeguro",
  "key": "string",
  "enabled": true
}
```

#### `PUT /api/settings/whatsapp`
**Request:**
```json
{
  "number": "+5511999999999",
  "enabled": true
}
```

---

### **Chat/IA**

#### `POST /api/chat`
**Request:**
```json
{
  "message": "string",
  "conversationId": "string (optional)"
}
```
**Response:**
```json
{
  "response": "string",
  "conversationId": "string"
}
```

---

## 🗄️ Models do MongoDB

### **User**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  credits: Number,
  plan: String,
  connectedNetworks: [{
    networkId: String,
    accessToken: String,
    refreshToken: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### **Project**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  videoUrl: String,
  thumbnail: String,
  status: String,
  duration: String,
  clips: [{
    id: String,
    startTime: String,
    endTime: String,
    score: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### **Settings**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  ai: {
    provider: String,
    model: String,
    apiKey: String,
    systemPrompt: String,
    temperature: Number,
    maxTokens: Number,
    enabled: Boolean
  },
  payment: {
    pix: { enabled: Boolean, key: String },
    mercadoPago: { enabled: Boolean, key: String },
    pagSeguro: { enabled: Boolean, key: String }
  },
  whatsapp: {
    number: String,
    enabled: Boolean
  },
  updatedAt: Date
}
```

### **Subscription**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  planId: String,
  status: String,
  startDate: Date,
  endDate: Date,
  paymentMethod: String,
  amount: Number,
  createdAt: Date
}
```

### **ChatConversation**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  messages: [{
    role: String,
    content: String,
    timestamp: Date
  }],
  createdAt: Date
}
```

---

## 🔄 Integração Frontend-Backend

### **Arquivos a Modificar**

1. **ChatWidget.jsx**: Integrar com endpoint `/api/chat`
2. **RedesSociais.jsx**: Conectar com `/api/social-networks/*`
3. **Dashboard.jsx**: Upload e listagem via `/api/projects`
4. **Financeiro.jsx**: Integrar com `/api/plans` e `/api/subscriptions`
5. **Configuracoes.jsx**: Integrar com `/api/settings/*`

### **AuthContext a Criar**
- Criar `/app/frontend/src/context/AuthContext.jsx`
- Gerenciar login/logout
- Armazenar token no localStorage
- Proteger rotas privadas

---

## 🎨 Manter Design com Cores da Bandeira

- **Amarelo**: `#FFD700`, `#FFEB3B`
- **Verde Limão**: `#BFFF00`, `#9ACD32`
- **Azul**: `#0099FF`, `#1E90FF`
- **Fundo**: `#000000`, `#0a0a0a`

Usar gradientes suaves com essas cores nos botões primários e destaques.
