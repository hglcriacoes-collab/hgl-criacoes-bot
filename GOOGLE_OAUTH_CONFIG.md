# ================================
# CONFIGURAÇÃO DO GOOGLE OAUTH
# ================================

## Como Obter as Credenciais do Google:

### 1. Acesse o Google Cloud Console
https://console.cloud.google.com/

### 2. Crie um Novo Projeto (ou use existente)
- Clique em "Select a Project" > "New Project"
- Nome: HGL Oficial
- Clique em "Create"

### 3. Ative a Google+ API
- No menu lateral, vá em "APIs & Services" > "Library"
- Procure por "Google+ API"
- Clique em "Enable"

### 4. Crie Credenciais OAuth 2.0
- Vá em "APIs & Services" > "Credentials"
- Clique em "+ CREATE CREDENTIALS" > "OAuth client ID"
- Application type: "Web application"
- Nome: "HGL Web Client"

### 5. Configure URLs Autorizadas
**Authorized JavaScript origins:**
```
http://localhost:3000
https://brasil-redes-pay.preview.emergentagent.com
https://seu-dominio.com
```

**Authorized redirect URIs:**
```
http://localhost:3000
https://brasil-redes-pay.preview.emergentagent.com
https://seu-dominio.com
```

### 6. Copie as Credenciais
Após criar, você receberá:
- **Client ID** (algo como: 123456789-abc...xyz.apps.googleusercontent.com)
- **Client Secret** (algo como: GOCSPX-abc...xyz)

---

## Configuração no Backend

Adicione no arquivo `/app/backend/.env`:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_REDIRECT_URI=https://brasil-redes-pay.preview.emergentagent.com
```

---

## Configuração no Frontend

Adicione no arquivo `/app/frontend/.env`:

```bash
# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=seu_client_id_aqui
```

**IMPORTANTE:** Use o MESMO Client ID em ambos!

---

## Testando

1. Reinicie o backend:
```bash
sudo supervisorctl restart backend
```

2. Reinicie o frontend:
```bash
sudo supervisorctl restart frontend
```

3. Acesse: https://brasil-redes-pay.preview.emergentagent.com/login

4. Clique em "Continuar com Google"

5. Escolha uma conta Google

6. Pronto! Login realizado automaticamente

---

## Variáveis de Ambiente Completas

### Backend (.env)
```bash
# MongoDB
MONGO_URL=mongodb://localhost:27017/
DB_NAME=hgl_db

# JWT Secret
SECRET_KEY=sua_secret_key_super_secreta_aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_REDIRECT_URI=https://brasil-redes-pay.preview.emergentagent.com
```

### Frontend (.env)
```bash
# Backend URL
REACT_APP_BACKEND_URL=https://brasil-redes-pay.preview.emergentagent.com

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=seu_client_id_aqui

# WebSocket Config
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

---

## Troubleshooting

### Erro: "Invalid Client ID"
- Verifique se o Client ID está correto
- Confirme que o domínio está nas Authorized JavaScript origins

### Erro: "redirect_uri_mismatch"
- Adicione a URL exata nas Authorized redirect URIs
- Não esqueça de incluir http:// ou https://

### Erro: "Access blocked"
- Vá em "OAuth consent screen"
- Adicione seu email como "Test user"
- Ou publique o app (se for produção)

---

## Segurança

⚠️ **NUNCA** commite as credenciais no Git!
⚠️ Use variáveis de ambiente
⚠️ Em produção, restrinja os domínios autorizados
⚠️ Mantenha o Client Secret seguro

---

## Para Produção

1. Configure o "OAuth consent screen" completo
2. Adicione logo, política de privacidade, termos de uso
3. Envie para verificação do Google (se necessário)
4. Configure domínios reais (sem localhost)
5. Use HTTPS obrigatoriamente
