# RicoAssessoriaMEC

Sistema completo para consulta de bachilleratos no site do MEC Paraguay.

## 📋 Descrição

Este projeto automatiza a consulta de validação de bachilleratos no site oficial do MEC Paraguay (`https://tramites.mec.gov.py/gestion_tramites/verificar_bachilleratos/`), utilizando:

- **Backend**: Node.js + Express + Puppeteer (automação web)
- **Frontend**: Next.js + TailwindCSS
- **Funcionalidades**:
  - Consulta automática no site do MEC
  - Geração de PDF do comprovante quando validado
  - Interface amigável para usuário final

---

## 🚀 Como Instalar e Executar

### Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn

### 1️⃣ Instalar Dependências

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2️⃣ Executar o Projeto

#### Iniciar o Backend (Terminal 1)
```bash
cd backend
npm run dev
```

O backend estará rodando em: `http://localhost:5000`

#### Iniciar o Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

O frontend estará rodando em: `http://localhost:3000`

### 3️⃣ Acessar o Sistema

Abra seu navegador em: **http://localhost:3000**

---

## ⚙️ Configuração dos Seletores

**⚠️ IMPORTANTE**: Antes de usar, você precisa ajustar os seletores CSS do site do MEC!

Abra o arquivo: `backend/src/services/puppeteerService.js`

Procure pela seção `CONFIG` no início do arquivo:

```javascript
const CONFIG = {
  URL: 'https://tramites.mec.gov.py/gestion_tramites/verificar_bachilleratos/',
  
  // 🔧 AJUSTAR ESTES SELETORES:
  INPUT_SELECTOR: '#campo-bachillerato',        // Seletor do campo de input
  BUTTON_SELECTOR: '#btn-consultar',            // Seletor do botão de consulta
  RESULT_SELECTOR: '#resultado',                // Seletor do elemento de resultado
  
  VALIDADO_KEYWORDS: ['VALIDADO', 'VÁLIDO', 'APROBADO', 'REGISTRADO'],
  TIMEOUT: 30000
};
```

### Como descobrir os seletores corretos:

1. Acesse o site: https://tramites.mec.gov.py/gestion_tramites/verificar_bachilleratos/
2. Pressione **F12** para abrir o DevTools
3. Clique no ícone de seleção (ou Ctrl+Shift+C)
4. Clique nos elementos da página:
   - **Campo de input**: onde você digita o bachillerato
   - **Botão**: que envia a consulta
   - **Área de resultado**: onde aparece a resposta

5. No DevTools, você verá o HTML do elemento. Procure por:
   - `id="algum-id"` → use `#algum-id`
   - `class="alguma-classe"` → use `.alguma-classe`
   - `name="algum-nome"` → use `[name="algum-nome"]`

6. Substitua os valores no arquivo `puppeteerService.js`

**Exemplos de seletores comuns**:
```javascript
INPUT_SELECTOR: '#numero'                    // Por ID
INPUT_SELECTOR: 'input[name="bachillerato"]' // Por atributo name
INPUT_SELECTOR: '.campo-numero'              // Por classe

BUTTON_SELECTOR: 'button[type="submit"]'
BUTTON_SELECTOR: '.btn-consultar'
BUTTON_SELECTOR: '#btnBuscar'

RESULT_SELECTOR: '#resultado'
RESULT_SELECTOR: '.resultado-validacao'
RESULT_SELECTOR: '.panel-resultado'
```

---

## 📁 Estrutura do Projeto

```
RicoAssessoriaMEC/
│
├── backend/                      # API Node.js + Express
│   ├── src/
│   │   ├── controllers/          # Lógica de controle
│   │   │   └── consultaController.js
│   │   ├── routes/               # Definição de rotas
│   │   │   └── consultaRoutes.js
│   │   ├── services/             # Serviços (Puppeteer)
│   │   │   └── puppeteerService.js
│   │   └── server.js             # Servidor Express
│   ├── prints/                   # PDFs gerados (gitignored)
│   ├── package.json
│   └── .gitignore
│
├── frontend/                     # App Next.js
│   ├── pages/
│   │   ├── _app.js
│   │   ├── _document.js
│   │   └── index.js              # Página principal
│   ├── styles/
│   │   └── globals.css           # Estilos TailwindCSS
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.local                # Variáveis de ambiente
│   └── .gitignore
│
├── shared/                       # Tipos e utilidades compartilhadas
│
└── README.md                     # Este arquivo
```

---

## 🔄 Fluxo de Funcionamento

1. **Usuário** digita o número de bachillerato no frontend
2. **Frontend** envia requisição POST para `/api/consulta-bachillerato`
3. **Backend** recebe a requisição e:
   - Abre o Puppeteer (navegador headless)
   - Acessa o site do MEC
   - Preenche o campo com o número
   - Clica no botão de consulta
   - Aguarda o resultado carregar
   - Extrai o texto do resultado
   - Verifica se contém palavras-chave de validação
   - Se **VALIDADO**: gera PDF da página
   - Fecha o navegador
   - Retorna JSON com status e URL do PDF
4. **Frontend** exibe o resultado e botão de download (se validado)

---

## 📡 API Endpoints

### POST `/api/consulta-bachillerato`

**Request Body**:
```json
{
  "bachillerato": "12345678"
}
```

**Response (Validado)**:
```json
{
  "status": "VALIDADO",
  "mensagem": "Texto extraído da página do MEC",
  "bachillerato": "12345678",
  "pdfUrl": "/prints/bachillerato_12345678_1234567890.pdf",
  "timestamp": "2025-11-19T12:34:56.789Z"
}
```

**Response (Não Validado)**:
```json
{
  "status": "NAO_VALIDADO",
  "mensagem": "Texto extraído da página do MEC",
  "bachillerato": "12345678",
  "pdfUrl": null,
  "timestamp": "2025-11-19T12:34:56.789Z"
}
```

### GET `/prints/:filename`

Serve os arquivos PDF gerados.

**Exemplo**: `http://localhost:5000/prints/bachillerato_12345678_1234567890.pdf`

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Puppeteer** - Automação de navegador
- **CORS** - Permitir requisições do frontend

### Frontend
- **Next.js** - Framework React
- **React** - Biblioteca UI
- **TailwindCSS** - Framework CSS
- **Axios** - Cliente HTTP

---

## 🐛 Troubleshooting

### Backend não conecta ao site

- Verifique se os seletores estão corretos
- O site pode ter mudado a estrutura
- Pode haver proteção anti-bot (captcha)

### Puppeteer não inicia

- No Windows, pode precisar instalar dependências do Chrome
- Tente executar com `headless: false` para ver o navegador

### PDF não é gerado

- Verifique se a pasta `backend/prints/` existe
- Verifique permissões de escrita

### Frontend não conecta ao backend

- Verifique se o backend está rodando na porta 5000
- Verifique o arquivo `frontend/.env.local`
- Verifique CORS no backend

---

## 📝 Notas Importantes

1. **Seletores**: Os seletores CSS são placeholders. Você DEVE ajustá-los conforme o site real.

2. **Captcha**: Se o site tiver captcha, será necessário:
   - Usar serviços de resolução de captcha
   - Implementar autenticação
   - Ou consultar APIs oficiais se disponíveis

3. **Rate Limiting**: Evite fazer muitas requisições seguidas para não ser bloqueado pelo site.

4. **PDFs**: Os PDFs são salvos em `backend/prints/`. Configure limpeza periódica se necessário.

5. **Produção**: Para deploy em produção:
   - Configure variáveis de ambiente adequadas
   - Use processo manager (PM2) para o backend
   - Configure servidor web (Nginx) como proxy reverso
   - Use HTTPS

---

## 📄 Licença

MIT

---

## 👨‍💻 Desenvolvido por

**Rico Assessoria**

Para suporte ou dúvidas, entre em contato.
