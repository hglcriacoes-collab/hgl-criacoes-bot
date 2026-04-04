# 🚀 GUIA DE INSTALAÇÃO - BOT HGL

## Guia Completo de Instalação e Configuração

---

## 📋 **PRÉ-REQUISITOS**

Antes de instalar, você precisa ter instalado:

### **1. Node.js e npm/yarn**
```bash
# Verificar se está instalado
node --version  # Deve ser v16 ou superior
npm --version   # ou yarn --version
```

**Instalar Node.js:**
- Windows/Mac: https://nodejs.org/
- Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### **2. Python 3.11+**
```bash
# Verificar versão
python3 --version  # Deve ser 3.11 ou superior
```

**Instalar Python:**
- Windows: https://www.python.org/downloads/
- Mac: `brew install python@3.11`
- Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install python3.11 python3.11-venv python3-pip
```

### **3. MongoDB**
```bash
# Verificar se está rodando
mongosh --version
```

**Instalar MongoDB:**
- Windows: https://www.mongodb.com/try/download/community
- Mac: `brew install mongodb-community`
- Linux (Ubuntu/Debian):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### **4. FFmpeg**
```bash
# Verificar instalação
ffmpeg -version
```

**Instalar FFmpeg:**
- Windows: https://ffmpeg.org/download.html
- Mac: `brew install ffmpeg`
- Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

---

## 📦 **INSTALAÇÃO**

### **PASSO 1: Baixar o Projeto**

**Opção A: Via Git (Recomendado)**
```bash
git clone https://github.com/seu-usuario/BOT_HGL_REDE_SOCIAIS_CORTES.git
cd BOT_HGL_REDE_SOCIAIS_CORTES
```

**Opção B: Download Manual**
1. Baixe o arquivo ZIP
2. Extraia para uma pasta
3. Abra o terminal na pasta extraída

---

### **PASSO 2: Instalar Dependências do Backend**

```bash
cd backend

# Criar ambiente virtual Python
python3 -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Instalar dependências
pip install --upgrade pip
pip install -r requirements.txt

# Instalar yt-dlp (download de vídeos)
pip install yt-dlp

# Instalar Playwright (automação)
pip install playwright
playwright install chromium
```

---

### **PASSO 3: Instalar Dependências do Frontend**

```bash
cd ../frontend

# Instalar dependências com yarn (recomendado)
yarn install

# OU com npm
npm install
```

---

### **PASSO 4: Configurar Variáveis de Ambiente**

#### **Backend (.env)**
Crie arquivo `.env` na pasta `backend/`:

```bash
cd backend
nano .env  # ou use qualquer editor de texto
```

Cole o seguinte conteúdo:

```env
# MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=hgl_database

# JWT Authentication
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456
JWT_ALGORITHM=HS256

# Diretórios
UPLOAD_DIR=/app/backend/uploads
PROCESSED_DIR=/app/backend/processed
```

**⚠️ IMPORTANTE:** Troque `JWT_SECRET` por uma chave aleatória forte!

Para gerar uma chave segura:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

#### **Frontend (.env)**
Crie arquivo `.env` na pasta `frontend/`:

```bash
cd ../frontend
nano .env
```

Cole o seguinte conteúdo:

```env
# Backend URL
REACT_APP_BACKEND_URL=http://localhost:8001

# Google OAuth (opcional)
REACT_APP_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
```

---

### **PASSO 5: Criar Diretórios Necessários**

```bash
# Voltar para pasta raiz
cd ..

# Criar diretórios
mkdir -p backend/uploads
mkdir -p backend/processed
mkdir -p backend/automation
```

---

### **PASSO 6: Iniciar MongoDB**

```bash
# Verificar se MongoDB está rodando
mongosh

# Se não estiver, iniciar:
# Windows: Abra MongoDB Compass ou inicie o serviço
# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

---

## ▶️ **EXECUTAR A APLICAÇÃO**

### **Modo Desenvolvimento (Recomendado para Teste)**

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python3 server.py
```

Você verá:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start  # ou npm start
```

Você verá:
```
webpack compiled successfully
```

**Acesse:** http://localhost:3000

---

### **Modo Produção (Opcional)**

#### **Backend com Gunicorn:**
```bash
cd backend
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker server:app --bind 0.0.0.0:8001
```

#### **Frontend - Build:**
```bash
cd frontend
yarn build  # ou npm run build
```

Servir com nginx ou outro servidor web.

---

## 🧪 **TESTAR A INSTALAÇÃO**

### **1. Testar Backend:**

```bash
# Em outro terminal
curl http://localhost:8001/api/health

# Resposta esperada:
{"status": "ok"}
```

### **2. Criar Usuário de Teste:**

```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@hgl.com","password":"123456"}'
```

### **3. Fazer Login:**

```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@hgl.com","password":"123456"}'
```

Você receberá um token JWT.

### **4. Testar Frontend:**

1. Abra: http://localhost:3000
2. Faça login com: `teste@hgl.com` / `123456`
3. Cole um link do YouTube
4. Clique "Fazer Upload"
5. Configure os cortes
6. Clique "Próximo"

---

## 🔧 **CONFIGURAÇÕES ADICIONAIS**

### **Google OAuth (Opcional)**

Para habilitar login com Google:

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto
3. Ative Google+ API
4. Crie credenciais OAuth 2.0
5. Configure URLs autorizadas:
   - JavaScript origins: `http://localhost:3000`
   - Redirect URIs: `http://localhost:3000/auth/google/callback`
6. Copie o Client ID
7. Cole no `frontend/.env`:
```env
REACT_APP_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
```

---

### **Configurar Supervisor (Linux) - Opcional**

Para rodar automaticamente no boot:

```bash
sudo nano /etc/supervisor/conf.d/hgl-backend.conf
```

```ini
[program:hgl-backend]
command=/caminho/para/backend/venv/bin/python3 server.py
directory=/caminho/para/backend
user=seu-usuario
autostart=true
autorestart=true
stderr_logfile=/var/log/hgl-backend.err.log
stdout_logfile=/var/log/hgl-backend.out.log
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start hgl-backend
```

---

## 🐛 **SOLUÇÃO DE PROBLEMAS**

### **Problema: MongoDB não conecta**

**Solução:**
```bash
# Verificar se MongoDB está rodando
sudo systemctl status mongod

# Iniciar MongoDB
sudo systemctl start mongod

# Verificar logs
sudo tail -f /var/log/mongodb/mongod.log
```

---

### **Problema: FFmpeg não encontrado**

**Solução:**
```bash
# Verificar se está no PATH
which ffmpeg

# Se não estiver, adicionar ao PATH ou instalar:
sudo apt-get install ffmpeg
```

---

### **Problema: Erro "body stream already read"**

**Solução:**
1. Limpe o cache do navegador
2. Pressione Ctrl+Shift+R (hard refresh)
3. Ou abra em modo anônimo

---

### **Problema: Porta 8001 ou 3000 já em uso**

**Solução:**
```bash
# Ver o que está usando a porta
sudo lsof -i :8001
sudo lsof -i :3000

# Matar o processo
kill -9 [PID]

# Ou use outra porta:
# Backend: Edite server.py → uvicorn.run(port=8002)
# Frontend: PORT=3001 yarn start
```

---

## 📊 **VERIFICAR STATUS DO SISTEMA**

```bash
# Backend
curl http://localhost:8001/api/health

# MongoDB
mongosh
> show dbs
> use hgl_database
> db.users.count()

# FFmpeg
ffmpeg -version

# yt-dlp
yt-dlp --version
```

---

## 🔐 **SEGURANÇA**

**⚠️ ANTES DE COLOCAR EM PRODUÇÃO:**

1. **Troque JWT_SECRET** por uma chave forte
2. **Configure CORS** no backend (apenas domínios permitidos)
3. **Use HTTPS** (Let's Encrypt gratuito)
4. **Configure firewall:**
```bash
sudo ufw allow 8001/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

5. **Crie usuário MongoDB com senha:**
```bash
mongosh
> use admin
> db.createUser({
    user: "hgl_user",
    pwd: "senha_forte_aqui",
    roles: [{role: "readWrite", db: "hgl_database"}]
  })
```

Atualize `MONGO_URL`:
```env
MONGO_URL=mongodb://hgl_user:senha_forte_aqui@localhost:27017
```

---

## 📈 **PRÓXIMOS PASSOS**

Após instalação bem-sucedida:

1. ✅ Testar upload de vídeo
2. ✅ Testar processamento de cortes
3. ✅ Configurar redes sociais
4. ✅ Personalizar prompts de IA
5. ✅ Configurar backup automático do MongoDB

---

## 🆘 **SUPORTE**

**Problemas com instalação?**

1. Verifique os logs:
   - Backend: `tail -f /var/log/supervisor/backend.err.log`
   - MongoDB: `sudo tail -f /var/log/mongodb/mongod.log`

2. Teste cada componente individualmente

3. Consulte a documentação completa: `DOCUMENTACAO_COMPLETA.md`

---

**Instalação Completa!** 🎉

Acesse: http://localhost:3000
