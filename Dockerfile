FROM node:18-slim

# Instalar dependências do Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Configurar Puppeteer para usar Chromium instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Criar diretório de trabalho
WORKDIR /app

# Copiar package.json do backend
COPY backend/package*.json ./backend/

# Instalar dependências do backend
WORKDIR /app/backend
RUN npm install --omit=dev

# Copiar código do backend
COPY backend/ ./

# Criar diretórios necessários
RUN mkdir -p prints pdfs

# Expor porta
EXPOSE 5000

# Iniciar servidor
CMD ["node", "src/server.js"]
