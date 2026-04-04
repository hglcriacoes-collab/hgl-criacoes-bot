#!/bin/bash

# 🚀 BOT HGL - INSTALADOR AUTOMÁTICO
# Instalador completo para BOT_HGL_REDE_SOCIAIS_CORTES

set -e  # Sair em caso de erro

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # Sem cor

echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║        🚀 BOT HGL - INSTALADOR AUTOMÁTICO 🚀        ║"
echo "║                                                       ║"
echo "║  BOT para Redes Sociais com Cortes Automáticos       ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar pré-requisitos
echo -e "${YELLOW}[1/8] Verificando pré-requisitos...${NC}"

# Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Instale Node.js 16+ primeiro.${NC}"
    echo "   Download: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 não encontrado. Instale Python 3.11+ primeiro.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python $(python3 --version)${NC}"

# MongoDB
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB CLI não encontrado. Certifique-se de que MongoDB está rodando.${NC}"
else
    echo -e "${GREEN}✅ MongoDB instalado${NC}"
fi

# FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ FFmpeg não encontrado. Instale FFmpeg primeiro.${NC}"
    echo "   Ubuntu/Debian: sudo apt-get install ffmpeg"
    echo "   Mac: brew install ffmpeg"
    exit 1
fi
echo -e "${GREEN}✅ FFmpeg $(ffmpeg -version | head -n1 | awk '{print $3}')${NC}"

# Yarn (instalar se não existir)
if ! command -v yarn &> /dev/null; then
    echo -e "${YELLOW}⚠️  Yarn não encontrado. Instalando...${NC}"
    npm install -g yarn
fi
echo -e "${GREEN}✅ Yarn $(yarn --version)${NC}"

# Criar diretórios necessários
echo -e "${YELLOW}[2/8] Criando diretórios...${NC}"
mkdir -p backend/uploads
mkdir -p backend/processed
mkdir -p backend/automation
echo -e "${GREEN}✅ Diretórios criados${NC}"

# Instalar dependências do backend
echo -e "${YELLOW}[3/8] Instalando dependências do Backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip -q
pip install -r requirements.txt -q
pip install yt-dlp -q
pip install playwright -q
playwright install chromium

echo -e "${GREEN}✅ Dependências do Backend instaladas${NC}"
cd ..

# Instalar dependências do frontend
echo -e "${YELLOW}[4/8] Instalando dependências do Frontend...${NC}"
cd frontend
yarn install --silent
echo -e "${GREEN}✅ Dependências do Frontend instaladas${NC}"
cd ..

# Configurar variáveis de ambiente
echo -e "${YELLOW}[5/8] Configurando variáveis de ambiente...${NC}"

# Backend .env
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
# MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=hgl_database

# JWT Authentication
JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")
JWT_ALGORITHM=HS256

# Diretórios
UPLOAD_DIR=/app/backend/uploads
PROCESSED_DIR=/app/backend/processed
EOF
    echo -e "${GREEN}✅ backend/.env criado${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env já existe (mantendo)${NC}"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    cat > frontend/.env << EOF
# Backend URL
REACT_APP_BACKEND_URL=http://localhost:8001

# Google OAuth (opcional - configure depois)
# REACT_APP_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
EOF
    echo -e "${GREEN}✅ frontend/.env criado${NC}"
else
    echo -e "${YELLOW}⚠️  frontend/.env já existe (mantendo)${NC}"
fi

# Verificar MongoDB
echo -e "${YELLOW}[6/8] Verificando MongoDB...${NC}"
if pgrep -x mongod > /dev/null; then
    echo -e "${GREEN}✅ MongoDB está rodando${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB não detectado rodando. Certifique-se de iniciá-lo:${NC}"
    echo "   sudo systemctl start mongod    (Linux)"
    echo "   brew services start mongodb-community    (Mac)"
fi

# Criar usuário de teste
echo -e "${YELLOW}[7/8] Criando usuário de teste...${NC}"
echo -e "${GREEN}✅ Use as credenciais:${NC}"
echo "   Email: teste.urgente@hgl.com"
echo "   Senha: 123456"

# Instruções finais
echo -e "${YELLOW}[8/8] Instalação concluída!${NC}"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║             ✅ INSTALAÇÃO COMPLETA! ✅               ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}📚 Para executar a aplicação:${NC}"
echo ""
echo -e "${GREEN}Terminal 1 - Backend:${NC}"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python3 server.py"
echo ""
echo -e "${GREEN}Terminal 2 - Frontend:${NC}"
echo "   cd frontend"
echo "   yarn start"
echo ""
echo -e "${GREEN}Acesse: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}📖 Documentação completa:${NC}"
echo "   - README.md"
echo "   - INSTALACAO.md"
echo "   - DOCUMENTACAO_COMPLETA.md"
echo ""
echo -e "${GREEN}🎉 Bom desenvolvimento!${NC}"
