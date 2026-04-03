# 🚀 Como Usar a Plataforma HGL - Guia Completo

## ✅ O Que Está Funcionando AGORA

### 1. **Sistema de Autenticação**
- ✅ Registro de novos usuários
- ✅ Login/Logout
- ✅ Proteção de rotas
- ✅ JWT tokens

### 2. **Upload e Processamento de Vídeos**
- ✅ Upload de arquivos de vídeo (MP4, MOV, MKV, AVI)
- ✅ Corte manual de vídeos com FFmpeg
- ✅ Corte automático em múltiplos clips
- ✅ Geração de thumbnails

### 3. **Conexão com Redes Sociais**
- ✅ Sistema para conectar contas
- ✅ Armazenamento seguro de credenciais
- ✅ Suporta 12 redes sociais

### 4. **Configurações**
- ✅ Configuração de IA (OpenAI/DeepSeek)
- ✅ Métodos de pagamento
- ✅ WhatsApp
- ✅ Chat com assistente virtual

---

## 📋 PRÓXIMOS PASSOS PARA TESTES REAIS

### Passo 1: Implementar Automação com Playwright

**Para Kwai e Snapchat (sem API oficial):**

```python
# /app/backend/routes/kwai_automation.py
from playwright.async_api import async_playwright

async def post_to_kwai(username, password, video_path, title):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # 1. Fazer login
        await page.goto('https://www.kwai.com/login')
        await page.fill('input[name="username"]', username)
        await page.fill('input[name="password"]', password)
        await page.click('button[type="submit"]')
        
        # 2. Ir para página de upload
        await page.goto('https://www.kwai.com/upload')
        
        # 3. Upload do vídeo
        await page.set_input_files('input[type="file"]', video_path)
        await page.fill('input[name="title"]', title)
        
        # 4. Publicar
        await page.click('button.publish')
        await page.wait_for_selector('.success-message')
        
        await browser.close()
        return {"success": True}
```

### Passo 2: Integração com APIs Oficiais

**YouTube API:**
```bash
# Instalar biblioteca
pip install google-api-python-client google-auth-oauthlib

# Configurar no Google Cloud Console:
# 1. Criar projeto em https://console.cloud.google.com
# 2. Ativar YouTube Data API v3
# 3. Criar credenciais OAuth 2.0
# 4. Baixar client_secret.json
```

**Instagram/Facebook (Meta API):**
```bash
# 1. Criar app em https://developers.facebook.com
# 2. Adicionar Instagram Basic Display API
# 3. Obter Access Token
```

### Passo 3: Fluxo Completo de Teste

```
1. REGISTRAR USUÁRIO
   POST /api/auth/register
   {
     "name": "Cliente Teste",
     "email": "cliente@teste.com",
     "password": "senha123"
   }

2. FAZER LOGIN
   POST /api/auth/login
   {
     "email": "cliente@teste.com",
     "password": "senha123"
   }
   → Recebe TOKEN

3. CONECTAR KWAI
   POST /api/social/connect
   Headers: Authorization: Bearer {TOKEN}
   {
     "network_id": "kwai",
     "username": "seu_usuario_kwai",
     "password": "sua_senha_kwai"
   }

4. UPLOAD DE VÍDEO
   POST /api/video/upload
   Headers: Authorization: Bearer {TOKEN}
   Form-data:
   - file: video.mp4

5. CORTAR VÍDEO AUTOMATICAMENTE
   POST /api/video/auto-cut/{video_id}
   {
     "clip_duration": 30,
     "max_clips": 5
   }

6. POSTAR NO KWAI
   POST /api/social/post
   {
     "network_id": "kwai",
     "video_path": "/caminho/do/clip.mp4",
     "title": "Meu vídeo viral!",
     "description": "Descrição aqui"
   }
```

---

## ⚙️ CONFIGURAÇÃO NECESSÁRIA

### 1. Instalar Playwright (para automação)
```bash
cd /app/backend
pip install playwright
playwright install chromium
```

### 2. Criar Script de Automação do Kwai

O arquivo precisa ser criado: `/app/backend/automation/kwai_bot.py`

```python
from playwright.async_api import async_playwright
import asyncio

async def login_kwai(page, username, password):
    await page.goto('https://www.kwai.com')
    # Implementar lógica de login específica do Kwai
    # Você precisa inspecionar o site do Kwai para pegar os seletores corretos
    pass

async def upload_video_kwai(page, video_path, title, description):
    # Implementar lógica de upload
    # Navegar até página de upload
    # Selecionar arquivo
    # Preencher título e descrição
    # Clicar em publicar
    pass
```

### 3. Configurar APIs Oficiais

**YouTube:**
- Criar projeto: https://console.cloud.google.com
- Ativar YouTube Data API v3
- Criar OAuth 2.0 credentials
- Salvar credenciais em `/app/backend/credentials/youtube_client_secret.json`

**Instagram:**
- Criar app: https://developers.facebook.com
- Configurar Instagram Basic Display API
- Obter Access Token de longa duração

---

## 🎯 TESTE RÁPIDO (SEM AUTOMAÇÃO)

Para testar SEM as redes sociais primeiro:

```bash
# 1. Registrar usuário
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com","password":"123456"}'

# 2. Fazer login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"123456"}'

# Pegar o TOKEN do response

# 3. Upload de vídeo
curl -X POST http://localhost:8001/api/video/upload \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "file=@/caminho/do/video.mp4"

# 4. Cortar vídeo
curl -X POST "http://localhost:8001/api/video/cut/VIDEO_ID" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"start_time":"00:00:10","end_time":"00:00:40"}'
```

---

## 🚨 LIMITAÇÕES ATUAIS

### ❌ Ainda NÃO Implementado:

1. **Automação de Kwai/Snapchat** - Precisa do script Playwright
2. **APIs Oficiais** - Precisa configurar credenciais
3. **Análise de IA** - Para detectar melhores momentos
4. **Fila de Processamento** - Para processar múltiplos vídeos
5. **Webhooks** - Para notificar quando vídeo foi processado

### ⚠️ O Que Precisa Para Funcionar 100%:

1. **Playwright scripts** para cada rede social sem API
2. **Credenciais** das APIs oficiais (YouTube, Instagram, etc)
3. **Servidor** com recursos para processar vídeos
4. **Armazenamento** (S3 ou similar) para vídeos grandes
5. **IP Residencial** (para evitar bloqueio em automações)

---

## 💡 RECOMENDAÇÃO

**Para começar a testar COM CLIENTES REAIS:**

1. **Semana 1:** Implementar automação do Kwai (3-5 dias)
2. **Semana 2:** Testar com 1-2 clientes piloto
3. **Semana 3:** Ajustar baseado no feedback
4. **Semana 4:** Adicionar mais redes sociais

**Precisa de ajuda para implementar a automação do Kwai?**
Posso criar o script completo de automação agora!

---

## 📞 Suporte

Se tiver dúvidas ou precisar de ajuda:
1. Verifique os logs: `/var/log/supervisor/backend.*.log`
2. Teste as APIs com Postman ou curl
3. Consulte a documentação em `/app/contracts.md`
